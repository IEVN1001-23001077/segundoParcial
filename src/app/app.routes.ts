import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'formularios',
        children:[
            {
                path:'usuarios',
                loadComponent:()=>
                    import('./formularios/usuarios/usuarios').then(
                        (c)=>c.Usuarios
                    ),
            },
            {
                path:'zoodiaco',
                loadComponent:()=>
                    import('./formularios/zoodiaco/zoodiaco').then(
                        (b)=>b.Zoodiaco
                    ),
            },
        ]
    },
    {
        path:'escuela',
        children:[
            {
                path:'listaAlumnos',
                loadComponent:()=>
                    import('./escuela/lista-alumnos/lista-alumnos').then(
                        (d)=>d.ListaAlumnos
                    ),
            },
        ]
    },
    {
        path:'', redirectTo:'admin', pathMatch:'full'
    },
    {
        path:'**', redirectTo:'admin'
    },
];
