# APP POLLA

## IMPORTANTE (09 julio 2022)
En esta etapa del proceso, queda en la rama `master` y se iniciará una nueva rama `alpha` la razon es que la nueva rama usará la metodologia de login con passport y se hará uso del motor de plantilla handlebars, tomando como base el proyecto [login-notes](../login-notes/readme.md), el cual permite entre otras cosas la opcion de logout

Esta rama `master` que hasta acá queda hace uso de autenticacion con jsonwebtoken, el cual permite generar un token al momento que el usuario se loguea, ese token trae encriptado el id del usuario y con ese id del usuario ya se puede hacer uso de todos los recursos. Dejé esta rama hasta acá con el objetivo que en el futuro pueda hacer una implementación de como iba en esta rama. Además el plateamiento que se tenia era con el uso del motor de plantilla `ejs`


## Apuntes básicos

Flujo de desarrollo
- Diseño de los modelos de bases de datos
- Desarrollo de index.js con la configuracion de express
- Desarrollo de la configuracion para la base de datos
- Desarrollo de las rutas, modelos y controladores con su chequeo en postman
- Desarrollo de la autenticacion
- Desarrollo de los roles
- Desarrollo de modelo apuestas, ya que como hay autenticación entonces las apuestas queda vinculado a la persona logueada
- Desarrollo de la logica del juego
- Diseño del frontend
    - Se instala boostrap y ejs
## Diseño de las funciones que permiten la lógica del juego
- Funcion que cuando el ADMON cargue resultado de partido, calcule el puntaje ganado por cada jugador



## Elementos a organizar antes de liberar la version 1.0
0. Cuando el usuario hace registro, le debe aparecer ya las apuestas de la priemra fase para su respectiva edicion de resultados, eso significa que se debe sistematizar una funcion que le cree todas las apuestas a cada jugador, pero solo se podrá hacer luego de que el admon haya guardado todos los juegos de la etapa inicial.

De igual manera, para el inicio de la segunda fase, cada apostador tendrá la apuesta ya montada (ocatvos de final) pero de allí en adelante debará poder jugar con las posibilidades de encuentros para cuartos, semi, tecer-cuarto y final

00. Lo de phase en el modelo de game y apuestas, revauar, sobre todo no neesito creeria to discreizar todo, con solo tener dos opciones phase 1 y pahase 2 creo es suficiente
1.  configurar la duracion de lo token en 1 dia o el tiempo que considere pertinente (actualmente esta en un año)
2.  La ruta para al auth dejarla por fuera de app es decir  raiz/auth
3. Analizar si resalmente es neceario el eliminar finalista por id (accede usuario) ya que en realidad solo cada apostador solo tiene un docuemento de apuesta y por ello seria sufuciente usar el eliminar todas los finalistas (de cosiderarse inutil entonces eliminar el enrutado api/bet/finalists/me/bet/:id)

4. Crear una funcion que permita recalcular TODOS LOS PUNSTAJES DE TODAS LAS APUESTAS POR JUEGOS, CLASIFICADOS Y FINALISTAS, por el momento el calculo de cada apuesta se logra cuando el admin ingresa un resultado, pero por seguridad se debe crear una especia de recalcular completo para evitar los calculos parciales
5. Hacer el analisis de replantear las rutas del tipo api/bet/finallists/me/bet..es decir de aquellas rutas que son propias de me, y que se hizo así de largo para evitar conflictos con otras rutas (la solucion para rutas mas cortas quizas usar una ruta incial difernte por ejemplo   bet/finallists/me)
6. Hacer control ya sea en frontend pero ojala desde el mismo backend de la cantidad de apuestas posible, por ejemplo en classificacion solo puede haber una clasificacion por grupo, por el momento no hay escriva verificacion algna para evitar redundancia de informacion. Esto debe aplicarse a todo lo correspondiente a apuestas 
## Para futuras versiones
-En la inserscion de datos desde admin, si estos se van hacer desde postman debo crear una capa de verificacion que permita por ejemplo validar que los id que se incorporan desde la url si existan en su respectiva base de datos

