import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { getZodiac } from 'lunar-ts';

interface RegistroZodiaco {
  nombre: string;
  apP: string;
  apM: string;
  dia: number;
  mes: number;
  anio: number;
  sexo: string;
  edad: number;
  signo: string;
}

@Component({
  selector: 'app-zodiac-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './zodiac-form.html',
  styleUrl: './zodiac-form.css'
})
export class ZodiacForm implements OnInit {

  formulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apP: new FormControl('', Validators.required),
    apM: new FormControl('', Validators.required),
    dia: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(31)
    ]),
    mes: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(12)
    ]),
    anio: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1900),
      Validators.max(2100)
    ]),
    sexo: new FormControl('', Validators.required)
  });

  registros: RegistroZodiaco[] = [];
  edad: number | null = null;
  signo = '';
  imagenSigno = '';
  mensajeError = '';

  private readonly animales: Record<string, string> = {
    rat: 'Rata',
    ox: 'Buey',
    tiger: 'Tigre',
    rabbit: 'Conejo',
    dragon: 'Dragón',
    snake: 'Serpiente',
    horse: 'Caballo',
    goat: 'Cabra',
    monkey: 'Mono',
    rooster: 'Gallo',
    dog: 'Perro',
    pig: 'Cerdo'
  };

  private readonly imagenes: Record<string, string> = {
    Rata: 'assets/zodiaco/rata.png',
    Buey: 'assets/zodiaco/buey.png',
    Tigre: 'assets/zodiaco/tigre.png',
    Conejo: 'assets/zodiaco/conejo.png',
    Dragón: 'assets/zodiaco/dragon.png',
    Serpiente: 'assets/zodiaco/serpiente.png',
    Caballo: 'assets/zodiaco/caballo.png',
    Cabra: 'assets/zodiaco/cabra.png',
    Mono: 'assets/zodiaco/mono.png',
    Gallo: 'assets/zodiaco/gallo.png',
    Perro: 'assets/zodiaco/perro.png',
    Cerdo: 'assets/zodiaco/cerdo.png'
  };

  ngOnInit(): void {
    this.cargarRegistros();
  }

  imprimir(): void {
    this.mensajeError = '';
    this.signo = '';
    this.imagenSigno = '';
    this.edad = null;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensajeError = 'Completa todos los campos correctamente.';
      return;
    }

    const datos = this.formulario.getRawValue();
    const { dia, mes, anio } = datos;

    if (dia == null || mes == null || anio == null) {
      this.mensajeError = 'Ingresa tu fecha de nacimiento.';
      return;
    }

    const fecha = new Date(anio, mes - 1, dia);
    fecha.setHours(12, 0, 0, 0);

    if (
      fecha.getFullYear() !== anio ||
      fecha.getMonth() !== mes - 1 ||
      fecha.getDate() !== dia
    ) {
      this.mensajeError = 'La fecha de nacimiento no es válida.';
      return;
    }

    const hoy = new Date();

    if (fecha > hoy) {
      this.mensajeError = 'La fecha no puede ser futura.';
      return;
    }

    this.edad = hoy.getFullYear() - anio;

    if (
      hoy.getMonth() < mes - 1 ||
      (hoy.getMonth() === mes - 1 && hoy.getDate() < dia)
    ) {
      this.edad--;
    }

    try {
      const animal = getZodiac(fecha.getTime());
      const clave = String(animal).toLowerCase();

      this.signo = this.animales[clave] ?? '';

      if (!this.signo) {
        this.mensajeError =
          'No se pudo reconocer el signo devuelto por la librería.';
        return;
      }

      this.imagenSigno = this.imagenes[this.signo] ?? '';

      const registro: RegistroZodiaco = {
        nombre: datos.nombre!.trim(),
        apP: datos.apP!.trim(),
        apM: datos.apM!.trim(),
        dia,
        mes,
        anio,
        sexo: datos.sexo!,
        edad: this.edad,
        signo: this.signo
      };

      this.registros.push(registro);
      this.guardarRegistros();

    } catch {
      this.mensajeError =
        'No se pudo calcular el zodiaco chino para esta fecha.';
    }
  }

  guardarRegistros(): void {
    localStorage.setItem(
      'registrosZodiaco',
      JSON.stringify(this.registros)
    );
  }

  cargarRegistros(): void {
    const datos = localStorage.getItem('registrosZodiaco');

    if (datos) {
      try {
        this.registros = JSON.parse(datos) as RegistroZodiaco[];
      } catch {
        this.registros = [];
      }
    }
  }

  eliminarRegistro(index: number): void {
    this.registros.splice(index, 1);
    this.guardarRegistros();
  }

  limpiarRegistros(): void {
    this.registros = [];
    this.guardarRegistros();
  }
}
