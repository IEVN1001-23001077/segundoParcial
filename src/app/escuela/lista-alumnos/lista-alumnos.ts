
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { IAlumno } from './alumno';

@Component({
  selector: 'app-lista-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './lista-alumnos.html',
  styleUrl: './lista-alumnos.css'
})
export class ListaAlumnos implements OnInit {

  formulario!: FormGroup;
  alumnos: IAlumno[] = [];
  indiceEdicion: number = -1;

  nuevoAlumno: IAlumno = {
    materia: '',
    nombre: '',
    matricula: '',
    correo: ''
  };

  ngOnInit(): void {
    this.formulario = new FormGroup({
      matricula: new FormControl(''),
      nombre: new FormControl(''),
      correo: new FormControl(''),
      materia: new FormControl('')
    });

    this.cargarAlumnos();
  }

  muestraAlumnos(): void {
    if (this.formulario.invalid) {
      return;
    }

    this.nuevoAlumno = {
      matricula: this.formulario.value.matricula.trim(),
      nombre: this.formulario.value.nombre.trim(),
      correo: this.formulario.value.correo.trim(),
      materia: this.formulario.value.materia.trim()
    };

    this.agregarAlumno();
  }

  agregarAlumno(): void {
    if (
      !this.nuevoAlumno.matricula ||
      !this.nuevoAlumno.nombre ||
      !this.nuevoAlumno.correo ||
      !this.nuevoAlumno.materia
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }

    if (this.indiceEdicion !== -1) {
      this.alumnos[this.indiceEdicion] = {
        ...this.nuevoAlumno
      };
    } else {
      this.alumnos.push({
        ...this.nuevoAlumno
      });
    }

    this.guardarAlumnos();
    this.limpiarCampos();
  }

  guardarAlumnos(): void {
    localStorage.setItem(
      'alumnos',
      JSON.stringify(this.alumnos)
    );
  }

  cargarAlumnos(): void {
    const datos = localStorage.getItem('alumnos');

    if (datos) {
      this.alumnos = JSON.parse(datos);
    } else {
      this.alumnos = [];
    }
  }

  editarAlumno(index: number): void {
    const alumno = this.alumnos[index];

    if (!alumno) {
      return;
    }

    this.indiceEdicion = index;

    this.nuevoAlumno = {
      ...alumno
    };

    this.formulario.patchValue({
      matricula: alumno.matricula,
      nombre: alumno.nombre,
      correo: alumno.correo,
      materia: alumno.materia
    });
  }

  eliminarAlumno(index: number): void {
    this.alumnos.splice(index, 1);

    // Reiniciar la edición si se elimina el alumno editado.
    if (this.indiceEdicion === index) {
      this.limpiarCampos();
    } else if (this.indiceEdicion > index) {
      this.indiceEdicion--;
    }

    this.guardarAlumnos();
  }

  limpiarCampos(): void {
    this.nuevoAlumno = {
      matricula: '',
      nombre: '',
      correo: '',
      materia: ''
    };

    this.indiceEdicion = -1;
    this.formulario.reset();
  }
}