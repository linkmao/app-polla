# APP POLLA

## IMPORTANTE (09 julio 2022) texto nuevo con el que se inicia la rama alpha
Doy inicio a la rama alpha, en donde se cambia la implementación de lo que se venia haciendo en master, la idea es que a futuro se pueda intervenir master, dandole continuidad a la impelmentacion del token tal como se venia desarrollando allí

En esta rama lo que se va hacer es implementar `passaport`para lo correspondiente al inicio de sesion, tal como se hizo en el proyecto guia de Fazt [login-notes](../login-notes/readme.md).

Comenzamos....

## IMPORTANTE (09 julio 2022) texto con el que se cierra la rama master
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


## Adefecio en el filtrado de apuestas por grupo ruta /groups/:g
A la fecha de escritura de este reporte (24 de julio de 2022) este fue uno de las implementaciones que mayor dificultad se me generó. Lo exoplico a continuación

### Objetivo:
El objetivo es que luego de que el usuario esté logueado e ingrese a sus juegos, pueda ver las apuestas (betGame) asociadas a su id, previamente filtrada por grupo, esto es que por ejemplo solo haya un get de las apuestas del grupo C y por lo tanto se renderice en pantalla las 6 apuestas correspondientes.

### Que se requiere:
Recoredemos la estructura de los modelos (solo se relaciona las propiedades mas relevantes para este caso)
- Team (admin): tiene el nombre del equipo, grupo, y nombre del archivo de la bandera
- Game (admin): id del localTeam, id del visitTeam, ademas de los resultados
- betGame (user): id del usuario, id del game, id del visitTeam, id del localTeam, y los marcadores propuestos, puntos ganados etc

Notese como el *grupo* solo está relacionado en el modelo Team, por lo tanto se debe hacer un encadenamiento entre las consultas de los modelos, para llenar un unico array betGameByGroup que solo tenga las apuesta del grupo requerido

### El problema
El problema de la impelmentacion basicamente es que las consultas las base de datos son asyncrónicas, no hay lio con elo, la cosa es que cuando se quiere llenar el array betGameByGroup con las apuestas solamente correspondiente al grupo solicitado, lastimosamente NO LLENA NADA. Es decir hasta la fecha tengo un serio problema de implementacion de un algoritmo compatible con el concepto de sincronia, por lo tanto debo estudiarlo mas para SIMPLIFICAR LA IMPLEMENTACION REALIZADA

### Solucion parcial (El adefecio)
A la fecha si se pudo construir el array con las apuestas del jugador correspondiente al grupo solicitado, pero su implementacion es un adefeciooooo por los siguientes motivos
    - Implemnetacion compleja de mantener
    - En consola aparecen warning que no quiero tener
    - Incluso se hace uso de consultas a la clase User, y dentro de esa consulta se coloca la implementacion, garantizando así que tal implemenatcion solo se da luego de que se hace la consulta a User y por lo tanto todos los datos necesarios ya estan guardados en variables para su posterior uso
Repito que la implementacion es funcional pero hay que mejorarlos si o si

### La solucion definitiva
-   Comprender muy bien e implementar el concepto de async await


## Modelo Group
Para la creacion de los modelos de apuesta asociado a las clasificaciones (betClassification) se encontró la necesidad de crear el modelo grupo, el cual tiene el grupo y los id de los equipos que pertenecen a ese grupo
Actualizacion 07 octubre: el modelo Group no se usará

## Modelo Bet-finalist
En una futura pero no muy lejana version, se sugiere eliminar el modelo Bet-finalist y hacer esa implementacion con bet-classification, usado la propiedad group con el valor FINAL para saber que se trata de la aspuesta de ls 4 equipos finales, esto requiere revisar todo el tema de controladores y rutas asociadas, pero se logra una buena refactorización

## PAra admin
Cuando el proyecto esté bien maduro e debe crear interfaz para la configuracion inicial del torneo entre ellos
- Insersion datos al modelo Team
- Insersion datos al modelo Group
- Insersion datos al modelo Game
- Insersion datos al modelo BetGame (el cual se da durante el desarrollo de los juegos)


## Consideraciones para el admin, para gestión del juego en su puesta en marcha

### Cracion de juego para cada apostador
A cada apostador se le genera una estructura de juego que depende de la estructura de juego configurada por admin, es por ello que ANTES DE INICIAR EL TORNEO, el admin debe crear los modelos y la estructura de juego, ya que por ejemplo betGame de apostador se crea a partir de Game de admin, eso no sucede cn betClassification, ya que su creación NO pedende de Classification

El motivo por el que betClassification no se crea a partir de Classification se debe a que el parametro que los relaciona es group, y todas las consultas se hacen con base en gruop, en cambio en betGame, está el parametro idGame que es el id del juego guardado en Game.

Considero que para no perder la estructura de consultas, en futuras versiones betClassification y Classification deberan estan relacionadas por idClassification tal como sucede con Game y betGame

### Insersion de equipos clasificados
En el modelo classification solo se debe ingresar firstTeam, secondTeam para la fase grupos
Para la fase FINAL se deben colocat firstTeam, secondTeam, thirdTeam, fourthTeam
Importante: No es necesario colocar el grupo, pues la implementación toma el grupo del modelo consultado


### Puntaje por ganador del juego de terceros y cuartos y final
Para que estos dos ultimos juegos tengan la misma estructura de ganar 3 puntos si el equpo se elige como ganador, entonces se creó el juego virtual 65. El admin debe en ese juego lo siguiente
    - localTeam: ganador juego 63 (3 y 4)
    - visitTeam: ganador juego 64 (final)
    - localScore: -2
    - analogScore:"-2"
    - visitScore:-2
    - forCalculate:true

    Es importante que localScore, analogScore y visitScore tengan valores no comparables con cualquier resultado posible



# Fase de despliegue

# Apuntes técnicos para este y otros proyectos
## Exportacion de la base de datos
Cuando se desarrolla en local la base de datos tambien es en local, llevar esa base de datos a la nube, en este caso a mongo atlas se siguien los siguientes pasos

1. Exportar la base de datos de local
$ mongodump --db [name database]
(esto me genera una carpeta dump y por dentro la carpeta con la base de datos exportada)
(Se debe tener descargado mongodump.exe y prendido el servicio de la base de datos con mongod)

2. Importar la base de datos en atlas
Se ingresa a Mongo atlas y de la seccion Cmd Line Tools se toma la linea de comando necesaria para restaurar la bd, la cual tiene esta estructura
$ mongorestore --uri mongodb+srv://maolink:<PASSWORD>@mongo-cluster.h360t.mongodb.net 
(En <Paswword> se copia el password del cluster)

y listo

## Despliegue en Heroku
Para el despliegue hay dos formas de hacerlo.
 Forma automática con Github
 Forma Manual con Heroku Cli

### Forma autómatica
0. Hacer commit del proyecto y push a Github
1. Loguearse en Heroku y crear proyecto
2. Luego de crear proyecto, en Deployment method se elige Connect with Github
3. Se elige el repositorio y la rama donde está el proyecto y listo.

## Despliegue en Heroku (se debe tener instalado heroku cli, verificar con $ heroku --version)
(Aun no funcional por error debo verificar cual es el error para documentarlo)
0. El proyecto debe estar con un commit completamente hecho
1. Ingresar a heroku en la web
2. Crear nueva app
3. Crear las variables de entorno necesarias en heroku, especialmente la de la base de datos
    En el cluster de ATLAS donde está la base de datos, se da en conect y se copia el uri
    En Settings, Config Var de Heroku, se crea la variable de entorno
4.  En package.json se debe tener el script "start": "node scr/index.js" o el necesario para ejecutar el index
5. Hacer login en heroku
    $ heroku login
    $ git init
    $ heroku git:remote -a [nombre app en heroku] 
    $ git add .
    $ git commit -m "Message"
    $ git push heroku master
(Para que el despliegue funcione al parecer si o si debe ser la rama master)

## Link de conexión a la base de datos
En mongoDB atlas y luego de haber configurado la seccion security donde se coloca el nombre de usuario y la conttraseña para el acceso a las base de datos, se elije la opcion connect
-   Connect your app
-   Se copia toda la URI que presenta, a la cual hay que agregarle la contraseña y el nombre de la base de datos (si no se pone el nombre de la base de datos, el sisetma crea uno de nombre test)

Nota: Mongo en las ultimas vesriones no muestra donde poner el nombre de la base de datos y por eso cuando la crea esta la llama test

mongodb+srv://maolink:<password>@mongo-cluster.h360t.mongodb.net/?retryWrites=true&w=majority

sin embargo, el nombre de la base de datos se puede ponder antes del ?

mongodb+srv://maolink:<password>@mongo-cluster.h360t.mongodb.net/<bdname>?retryWrites=true&w=majority

## Variable de entorno en heroku
El link de la base de datos se debe llevar a la variable de entorno de heroku, cuando se accede por chrome extrañamente hay problemas en actualizar la información, así que se sugiere usar mozilla 
--settings--reveals config vars

Otra opcion es usar heroku cli, luego de haber hecho heroku login y usar la siguinete linea

heroku config:set MONGODB_URI=mongodb+srv://maolink:<password>@mongo-cluster.h360t.mongodb.net/<bdname>?retryWrites=true&w=majority


Con esto hecho.. es de esperarse que todo corra ok


## Algunos comandos útiles de heroku
Hacer login
    heroku login       (Se loguea desde la web)
    heroku login -i   (Se loguea desde consonla)

Crear una nueva app
    heroku apps:create [nombre-app]

Listar las apps
    heroku apps

Borrar una app
    heroku  apps:destroy [nombre-app]

Despliegue de una app (previamente se debe tener el commit hecho en master)
    heroku git:remote -a [nombre-app]
    git push heroku master

Despues de que se hace push con git los comandos de heroku estan asociados a la app del directorio actual, por ejemplo 
   heroku config:set [varable-entorno=valor] coloca la variable de entorno en la app asociada a la carpeta actual, si se desea acceder a otra app desde cualquier carpeta se debe agregar --app [nombre-app]
    heroku config:set [varable-entorno=valor] --app [nombre-app]


Ver la consola de una app
    heroku logs --tail [nombre-app]    

Asignar una variable de entorno a una app
    heroku config:set [varable-entorno=valor]

Ejemplo:
    heroku config:set MONGODB_URI=mongodb+srv://maolink:<password>@mongo-cluster.h360t.mongodb.net/<bdname>?retryWrites=true&w=majority

Abrir la app
    heroku open

Reinciar la app en heroku
    heroku restart --app [nombre-app]


# LOG PRUEBAS AND PRINCIPAL TASKS
PRIORIDADES PARA LANZAMIENTO
- (OK SIN NOVEDAD)  COLOCAR EXPIRACION TOKEN ADMON POR 2 MESES
- (OK SIN NOVEDAD)  HABLITAR DE NUEVO POR FRONTEND EL CAMBIO DE CONTRASEÑA
- (OK SIN NOVEDAD)  HABILITAR DE NUEVO EL CAMBIO DE PERIL POR FRONTEND
- (OK SIN NOVEDAD)  VERIFICAR QUE TODAS LAS RUTAS SE ACCEDAN DESDE EL FRONTEND
- (OK SIN NOVEDAD)  DESHABILITAR MANUALMENTA OCTAVOS
- (OK SIN NOVEDAD)  Que se vea el nombre del grupo que se está apostando.
- (OK SIN NOVEDAD)  colocar en la parte superior el nombre de la fase que se está apostando
- Poner el balon que dice MIla
- modificar menú por iconos (si es posible)
- (OK SIN NOVEDAD) Quitar la opcion en el marcador de valres negativos.
- HACER COPIA DE SEGURIDAD DE LA BASE DE DATOS DE LA PRUEBA
- SETEAR EL JUEGO (INCLUYE KEY)
- HACER MANUEAL DE USO Y ENVIAR A CHAT
- COMPRAR DYNO Y CONFIGURAR CERTIFICADO SSL


PRIORIDAD POSTERIOR
- Correción de errores EN LA PRUEBA REALIZADA EL VIERNES
- coleres en las tarjetas dependiendo si se ha jugado el juego  (aplica tambien a juego tercer y cuarto y final)
- VAriable de entorno para eliminar la posibiidad de apostar (o data en BD o nuevo despliegue)
- VAriable de entorno para deshabilitar octavos (o data en BD o nuevo despliegue)
- en los juegos de la fase final, cambiar la palabra clasifica por ganador en la eleccion del equipo que gana
- persitencia en el forulario de registro
- Permitir recuperacion de contraseña
- Banderas en juegos de octavos
- SISTEMATIZAR VALIDACION DE JUEGOS NO DILIGENCIADOS Y OBTENER INFORME (PILAS CON EL JUEGO FANTASMA SI EL CREITERIO ES "-1" PUES LO TENDRÁ)


    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            <img src="/img/iconos/game-by-group.png" alt="">
          </a>

        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            <img src="/img/iconos/game-by-phase.png" width="15%" alt="">
          </a>


              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            <img src="/img/iconos/point.png" width="15%" alt="">
          </a>

                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            <img src="/img/iconos/profile.png" width="15%" alt="">
          </a>





         
 <ul class="navbar-nav me-auto mb-2 mb-lg-0">

    <li class="nav-item dropdown">
 
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            {{localName}}
          </a>

        
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="/routegames">Mis juegos</a></li>
            <li><a class="dropdown-item " href="/eighth">Mis apuestas octavos</a></li>
            {{#if octavosCompleted}}
            <li><a class="dropdown-item" href="/fourth">Mis apuestas cuartos</a></li>
            {{else}}
            <li><a class="dropdown-item disabled" href="/fourth">Mis apuestas cuartos</a></li>
            {{/if}}
            {{#if cuartosCompleted}}
            <li><a class="dropdown-item" href="/semi">Mis apuestas semifinal</a></li>
            {{else}}
            <li><a class="dropdown-item disabled" href="/semi">Mis apuestas semifinal</a></li>
            {{/if}}
            {{#if semiCompleted}}
            <li><a class="dropdown-item" href="/finals">Mis apuestas final</a></li>
            {{else}}
            <li><a class="dropdown-item disabled" href="/finals">Mis apuestas final</a></li>
            {{/if}}
            <li>
              <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" href="/detailpoints">Detalle puntaje</a></li>
            <li><a class="dropdown-item" href="/detailpointsgamers">Detalle puntaje jugadores</a></li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" href="/profile">Editar perfil</a></li>
            <li><a class="dropdown-item" href="/password">Cambiar contraseña</a></li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" href="/auth/logout">Cerrar sesion</a></li>
          </ul>
        </li>
         
      </ul>