# APP POLLA

## GENERALIDADES
Diseño e implementación de un sistema de apuesta para juegos de futbol, particularmente para torneos tipo Mundial de Futbol, Copa América o similares. El sistema de apuesta está basado en lo que normalmente he denomindao polla mundialista, la cual tradicionalmente la venia desarrolandohaciendo uso de una hoja de calculo de excel.

## TECNOLOGÍAS USADAS
-   nodejs
-   express
-   handlebars
-   mongodb
-   boostrap

## DESCRIPCIÓN DEL SISTEMA DE JUEGO
El juego consiste en apostar el posible marcador numérico de cada resultado, y el resultado análogo de cada pardido (Local, Empate, Visitante), dependiendo de si se acierta o no dichos resultados se fa puntaje.
Adicionalmente en la ronda de grupos se da puntaje si se acierta a la clasificación de los equipos a la ronda de fases, y finalmente tambien se gana punto por acertar los 4 finalistas del torneo.
Para los detalles del sistema del juego [consulte este documento](./supplies/Reglas%20e%20imagenes/Reglas%20Polla%20Copa%20mundial%20de%20futbol%20%202022%20-%20Ronda%20grupos.pdf)

## REFERENCIAS
**Ref:** Sin video base

**Repo:** [Repositorio](https://github.com/linkmao/app-polla)

**Deploy:** [Despliegue](https://polla.maolink.co) 

***

## CORRER LA APP

Activar el servicio de mongodb en local o tener la bd en la nube como mongodbAtlas, ya sea una u otra opción se debe insertar el enlace de conexión en el archivo `.env` (en el caso de que se corra en local) o en la respectiva variable de entorno de la plataforma donde se despliegue (Heroku, Railway, Digital Ocean)

Para ello en el archivo `.env` se debe colocar el string de conexion con la base de datos en la variable de entono `MONGODB_URI`

- Si se corre entonces se activa el servicio de mongo
```
mongod
```

- Se corre la aplicación
```
npm run dev
```

## USO ADMIN DE LA APP
El admin del juego es fundamental ya que es el encargado de alimentar la base de datos con la info necesaria, además de ir proporcionando los resultados de los partidos y las clasificaciones.
**Se espera que en futuras versiones se desarrolle el frontend para facilitar la administración del juego.**

En la versión actual, toda la administración de la base de datos se hace por medio de la api diseñana para tal fin, se sugiere el uso de postman para tal fin.

### ANTES DEL INICIO DEL TORNEO

1. Creación del usuario admin: Petición POST a traves de la ruta `/auth/signup/admin`, con los siguientes items.

    `{"email":"correodeladmin.com",
      "pass":"password del admin",
      "name":"nombre del admin",
      "lastName":"apellido del admin",
      "phone":"telefono del admin",
      "key":"codigo secreto solo conocido por el futuro admin"}`

    *key:* Para garantizar que solo el poseedor de la app, el cual se espera sea el admin de la misma, en key se debe colocar el mismo string que se encuentra en la variable de entono `CODE_FOR_CREATE_ADMIN`, eso significa que quien posea esta app debe crear el archivo `.env` y crear allí la variable de entorno ya anotada y escribir el string que desee como key.
    
2.  Logueo del admin:Peticion POST en la ruta `/auth/signin/admin`
`{"email":"email del admin", "pass":"Pass del admin"}`
Postman proporcionará un token que debe ser usado en Headers con el parametro `x-access-token`

    Nota: La duración de la validez del token se puede configurar en el archivo [config.js](./src/config/config.js) en la propiedadad `tokenDuration`


3. Creación de los equipos: Petición POST en la ruta `/api/teams`, con los siguientes items 

    `{"name":"Nombre del equipo,group:"Grupo al que pertenece",
    "flag":"bandera-del-equipo.png","tag":"Etiqueta"}`

    *tag es una etiqueta, alguna descripción o simlar, en el desarrollo o implementación no fue relevante, un ejmeplo de tag es por ejemplo A2, lo que significa por ejemplo que el equipo es el segundo equipo del grupo A*
    
4. Creación de los partidos: Petición POST en la ruta `/api/games`.

     Se debe crear TODA LA ESTRUCTURA DEL TORNEO, es decir todos los partidos que se realizarán en el torneo, para el caso de los partidos finales que dependen de la clasificación de los equipos, el modelo colocará un id genérico que posteriormente se deberá cambiar por el id del equipo realmente clasificado.

    `{"gameNumber":Número del partido (int), "phase":Numero de la fase (int), "localTeam":"ID del equipo local", "visitTeam":"ID del equipo visitante", "group":"Grupo al que pertenecen los equipos", "description":"Fecha, hora y o lugar del partido"}`

    *gameNumber:* Es de esperarse que el torneo en su fixture proporcione un número de los partidos, el cual es absolutamente necesario para el funcionamento del sistema de juego de la app, en caso de que el torneo no proporcione un número de juego entonces el admin debe crear un sistema propio de número de juego. Este parámetro es necesario, especialemete en la ronda de fases donde cada equipo va clasificando creando así un nuevo partido. El *gameNumber* es un parámetro que se usa sifnificativamete en la configuración del sistema de juego en el archivo [config.js](./src/config/config.js)

    *phase:* Es un entero que determina la fase en la que se encuentra el juego, para el mundial qtar 2022 las fases fueron las siguientes:

        - Ronda de grupos: 1
        - Ronda octavos de final: 2
        - Ronda cuartos de final: 3
        - Ronda semifinal: 4
        - Ronda final (partido por 3 y 4 puesto y partido final): 5
    El parametro *phase* es importante para el funcionamiento de la lógica de la app, para su configuración se puede acceder al archivo [config.js](./src/config/config.js)
    En caso de que la app se use para un torneo donde las fases son difernetes, se debe entonces afectar este parámetro y revisar detalladamente como afecta en la lógica del programa.

    *localTeam y visitTeam:* Es el ID correspondiente a los equipos que se enfrentan en el juego, para el caso de los partidos de la ronda de fases (donde cada partido depende de los que van clasificando) entonces no colocar estos campos en el Json, el sistema colocará un string por defecto.

    *group:* Grupo al que pertence el partido que se desarrolla, esto es válido para los juegos de la fase de grupos, para los partidos de la ronda de fases, no colocar este parámetro, el sistema colocará un string por defecto.

5. Creación de las clasificaciones: Peticion POST en la ruta `/api/classification`. Se insertan los datos de las clasificaciones, al inicio del torneo solo es necesario especificar la cantidad de documentos asociados a la cantidad de grupos de clasificaciones, es decir no es necesario insertar los id de los equipos pues logicamente no se conocen

    `{"group": "Grupo de la clasificación","firstTeam": "Id del equipo clasificado en la posicion 1","secondTeam":"Id del equipo clasificado en la posicion 2","thirdTeam": "Id del equipo clasificado en la posicion 3","fourthTeam": "Id del equipo clasificado en la posicion 4"}`

    Si en el torneo hay 8 grupos entonces esta colección tendrá 9 documentos (incluyendo el documento para la clasificación final).

    *group:* Es el grupo al cual pertenece la clasificación (A, B, C, etc) este mismo modelo sirve para la clasificación final la cual valora la clasificacion de los cuatro finalistas del torneo, el nombre que debe tener el grupo para esta información debe es estrictamente FINAL

    Se hace énfasis que en la configuración inicial del torneo es necesario crear esta colección con los grupos de las clasificaciones sin los equipos.

6. Creación de llaves de registro (keys): petición POST en la ruta `/api/keys` Para garantizar que solo se pueda registrar solo las personas que e admin autorice, se ha implementado el uso de llaves de registro, las cueales se debe crear y proporcional al usuario que se desea registrar.

    `{"keyNumber":Número de la llave (int), "keyCode":"Codigo que se desea crear"}`

    *keyNumber:* Corresponde a un entero que de alguna manera identifica como un consecutivo la llave creada (1, 2 , 3 etc) no es relevante este dato pero se recomienda que sea consecutivo por cada llave creada.
    *keyCode:* Es la llave que el admin crea y que posteriormente comparte con el usuario autorizado, es un sring cualquiera (se sugiere un string sin espacio, por ejemplo AMY651, LUT412, etc)

7. Configuración de otros elementos: En el archivo [config.js](./src/config/config.js) estan algunos elementos que el admin puede configurar, entre los que encuentra los puntajes para cada acierto, el número de la fase de los juegos etc, a continuación se describen algunos de vital importancia, pues estan directamente ligado con la forma en que funciona la lógica de la app.

    -   Sistema de juegos de las clasificaciones: Las llaves que se van conformando a medida que avanza el torneo se configuran en los paramétros `gamesEighth`, `gamesFourth`, `gamesSemi`, `finalStruct`, los cuales son arrays que contienen la relación de los equipos que van formando cada llave, estos estan determinados por el `gameNumber`de allí la importancia de tener claridad de ese parámetro, en los comentarios del archivo [config.js](./src/config/config.js) se detalla como se usan tales parámetros.

    - Game phantom: El juego fantasma es un juego que no se da en el torneo, pero que sirve para validar el puntaje por ganador del juego de 3 y 4 y del juego final, su imlementación todavia es un poco confusa,así que se debe tener cuiadado con ello, el juego fantasma tiene como `gameNumber` el total de partidos + 1

    - Opciones de visualización: en el archivo [config.js](./src/config/config.js) estan definidos unos flags de tipo booleano que permiten la visualización o no de ciertos elemntos frontend, algunos de estas flgas son `renderButtonRegister`, `renderBetRoundPhases` etc, el uso de estas flags se detalla en el archivo [config.js](./src/config/config.js), los cuales se activan y desactivan en función de la necesidad.

### DURANTE EL DESARROLLO DEL TORNEO
A continuación se detalla la intervención del admin durante el desarrollo del toneo, donde básicamente tiene las siguientes responsabilidades.

-   Garantizar que todas las apuestas de todos los partidos y clasificaciones hayan sido dilgenciadas.
-   Registrar el marcador de cada partido.
-   Registrar los clasificados de la ronda de grupos a la ronda de fases.
-   Actualizar la tabla de resultados generales
-   Registrar los equipos clasificados en cada partido de la ronda de fases.
-   Registrar los cuatro equipos finalistas (campeon, subcampeón, tercer y cuarto lugar).
-   Registrar los equipos del gamePhantom (por revisar)
-   Restablecer contraseña de algún usuario.

**Garantizar que todas las apuestas de todos los partidos y clasificaciones hayan sido dilgenciadas**

Se debe garantizar que todas la apuestas de todos los jugadores estén realizadas. Las apuestas se dividen en dos momentos:

*Momento 1* Apuestas de la ronda de grupos, esta apuestas se realizan estrictamente antes del inicio del torneo, todos los jugadores deben tener las apuestas de todos los partidos de la ronda de grupos, al igual de las apuestas de los dos clasificados de cada grupo, el admin puede verificar dichas apustas usando las ruta

Petición GET `/verifygamesgroups/id-user`

Petición GET `/verifyclassgroups/id-user`

Estas peticiones devuelven la cantidad de juegos y clasificaciones respectivamente sin diligenciar del usuario con id-user, la canntidad de juegos sin diligenciar se devuelven por consola y la información de cuales juegos o clasificaciones son se devuelven como json en postman.

*Momento 2* Apuestas de la ronda de fases, y las clasificaciones de lso cuatro finalistas, estas apuestas se deben realizar justo terminada la ronda de grupos y antes del inicio de la ronda de fases. El admin verifica que tales apuestas estén hechas por medio de las siguientes rutas

Petición GET `/verifygamesphases/id-user`

Petición GET `/verifyclassfinal/id-user`

Estas peticiones devuelven la cantidad de juegos y clasificacion final respectivamente sin diligenciar del usuario con id-user, la canntidad de juegos sin diligenciar se devuelven por consola y la información de cuales juegos o clasificaciones son se devuelven como json en postman.

En ambos momentos, una respuesta por Postman del tipo `{"message":[]}` significa que todos los juegos o clasificaciones han sido diligenciados.

**Registrar el marcador de cada partido**

Esta quizas es la mayor actividad del admin, pues despues de cada partido se debe reportar el resultado.

Petición PUT `/api/games/id-game`

`id-game` corresponde al id del juego que se quiere actualizar

`{"localScore":goles local(int), analogScore:"L o E o V", "visitScore":goles visitalte (int), "forCalculate":true}`

*forCalculate* Esta propiedad es un booleano y es de vital importancia su uso, si el admin solo lo que hace es acceder a la actualización de algun juego, por ejemplo, corregir un equipo, un tag o algo similar entonces `forCalculate` debe estar en false o no colocarse, **pero si se está registrando un resultado despues de un partido, para que el sistema haga el cálculo de los puntajes, `forCalculate` debe estar en true**


**Registrar los clasificados de la ronda de grupos a la ronda de fases**

Al finalizar todos los partidos de un grupo en particular se debe entonces registrar los clasificados por cada grupo en el modelo `classification`, para ello se usa la siguiente ruta

Peticion PUT `/api/classifications/id-classification`

`id-classification` es el id de la clasificacion del respectivo grupo

`{"firstTeam": "Id Equipo posicion 1", "secondTeam": "Id Equipo posición 2", "thirdTeam": "Id Equipo posición 3", "fourthTeam": "Id Equipo posición 4", "forCalculate":true}`

*forCalculate* Tiene el mismo uso que en el caso de la actualización de los juegos, por lo tanto debe ser true, para que el sistema haga los respectivos calculos en los puntajes de los participantes.

**Nota:** El sistema de juego solo considera puntaje por el equipo en la primera posición y en la segunda posición, no hay nda malo registrar loso cuatro pero en realidad solo está considerando los 2 primeros por grupo.

**Actualizar la tabla de resultados generales**
La implementación del calculo del consolidado de todos los resultados de todos los jugadores implica bastante procesamiento, el cual se debe hacer solo una vez cada que se actualiza el resultado de un game o una clasificación, y así los jugadores pdrá tener actualizado la tabla de consolidado de puntaje de todos los jugadores.

Petición GET `/updatepoint`
Esto realizará los calculos pertinentes (según la puesta en uso, para 20 jugadores, el calculo demora al rededor de 60 segundos.)

**Nota:** Esta actualización se debe hacer siempre despues de registrar resultados de juegos o clasificaciones, aunque no necesariamente despues de cada uno de ellos, es decir, se pueden registar dos o mas resultados de juegos o clasificaciones y posterirmente hacer uso de la ruta.


**Registrar los equipos clasificados en cada partido de la ronda de fases**
Terminada la ronda de grupos, el admin debe hacer la actualización de los juegos de octavos de final con los equipos realmente clasificados, usando lo siguiente.

Petición PUT `/api/games/id-game`

`{"localTeam":"id del equipo local", "visitTeam":"Id del equipo visitante"}`

*id-game*: corresponde al id del juego que se va actualzar

Cabe resaltar que todos los partidos de la fase octavos se debe actualizar para que los jugadores realicen sus apuestas desde allí.

Los partidos de cuartos, semi , tercer y cuarto y final se va diligeniado a medida que se va conformado la llave correspondiente, pero siempre por supuesto antes del respectivo partido.

**Registrar los cuatro equipos finalistas (campeon, subcampeón, tercer y cuarto lugar)**

Similar a lo que se hizo con los clasificados en la ronda de grupos, los cuales se registraron en el modelo `classification` se debe hacer el registro de los 4 finalistas en su respectivo orden.

Petición PUT `/api/classifications/id-classification`

`id-classification` es el id de la clasificacion del grupo marcado como FINAL

`{"firstTeam": "Id Equipo campeón", "secondTeam": "Id Equipo subcampeón", "thirdTeam": "Id Equipo tercer puesto", "fourthTeam": "Id Equipo cuarto puesto", "forCalculate":true}`

*forCalculate*: Debe estar en true para que el sisetma realice el cáculo de los diferentes puntos ganados por las clasifiaciones final. En la clasificación final si se tiene en cuenta los cuatro clasificados, por lo tanto se deben registrar los id de los 4 equipos.

**Registrar los equipos del gamePhantom (por revisar)**

El sistema de juego tal como se tiene proyectado da puntaje por cada equipo que realmente pasa a la otra fase, todo el sistema funciona bien pero los dos ultimos juegos (tercer y cuarto puesto y finales) no arman llaves, por lo tanto la lógica se rompe, es por eso que se hace uso del juego fantasma el cual contendrá el ganador de cada uno de esos dos partidos, su registró será así.

Petición PUT `/api/games/id-game-phantom`

`{"localTeam":"id del equipo ganador juego 3 y 4 puesto", "visitTeam":"Id del equipo ganador del juego final", "localScore":-2, "visitScore":-2,"analogScore":"-2", "forCalculate":true}`

*id-game-phantom*: corresponde al id del juego fantasma (un juego mas de los realmente jugados)

Es importante colocar los resultados y el analogScore tal cual se muestra en esta plantilla

**NOTA IMPORTANTE**: Esta funcionalidad está por verificar pues presentó problemas al momento de su implementación, entre las cosas que hay que mirar con precuación es el id del equipo que se lleva a localTeam y vositTeam respectivamente pues en un apunte en el cuaderno dice lo contrario a lo anotado anterriormente (en el cuaderno dice que localTeam:"Id Campeón", visitTeam:"Id ganador 3 y 4").

**Restablecer contraseña de algún usuario**

En el caso que se requiera restablacer una contraseña se procede así

Peticion PUT `/api/users/id-user-a-restablecer-pass`

`{"pass":"$2a$10$Bvc/AVRGNXgJBaBj8AL/8u4YMVFGqq.kXcnJkHzf2ohaMyOLqwzXa"}`

El string que se está usando es el correspondiente a la palabra *password*, por lo tanto se le indica al usuario que su nueva contraseña es *password*

***
# DEVELOPER NOTES
Esta seccion es solo de interés personal o para otros desarroladores

## Flujo de desarrollo
Flujo de desarrollo que encontré lógico para este tipo de proyecto (esto puede seguir de guia para proyectos similares )
- Diseño de los modelos de bases de datos
- Desarrollo de index.js con la configuracion de express
- Desarrollo de la configuracion para la base de datos
- Desarrollo de las rutas, modelos y controladores con su chequeo en postman
- Desarrollo de la autenticacion
- Desarrollo de los roles
- Desarrollo de modelo apuestas, ya que como hay autenticación entonces las apuestas queda vinculado a la persona logueada
- Desarrollo de la logica del juego
- Desarrollo del sistema de cargue de resultados y calculo de puntejes a los apostadores
- Diseño del frontend

## Descripción detallada (en lo posible ;))de la lógica de la app

Este sistema se basa fundamentalmente en los reistros que se hacen en los modelos de datos, guardados en mongoDB, basicamente se divide en dos grandes estructuras:

Estructura 1: Modelos team, game, classification. Estas dos estructuras de datos contienenen los equipos participantes, los juegos a desarrolaarse y las clasificaciones por grupo y final, estos datos solo son de acceso del admin.

Estructura 2: Modelos betgame, betclassification. En esta estructura de datos se guardan las apuestas que hacen los usuarios, estos registros se llenan por medio del forntend diseñado y natturalmente solo accede el respectivo usuario logueado 

Otros modelos de la app son user que contiene los usuarios registrados y keys el cual tiene unas llaves que el admin crea y garantizar asi que solo usuarios autoriazados puedan hacer un registro.

Los puntajes que se obtienen despues de cada partido o clasificación es el fruto de la comparacion de los modelos game y bet-game, al igual de classification y bet-classification.

Antes del lanzamiento para el mundial de Qtar en noviembre de 2022 se desarrollaron pruebas manuales haciendo verificaciones sobre todo que el sistema de puntaje si funcionara como corresponde.

El despliegue se hizo inicialmente en Heroku, pero para la fecha del lazamiento (noviembre de 2022) Heroku dejó de ser gratuito, desplegué tambien en railway, pero finalmente opté por conseguir un dominio (maolink.co) y contratar un servicio básico en digital ocean, permitiendo asi tener un control absoluto del despliegue.

La base de datos se desplegló en mongodb Atlas y su funcionamiento fue realmente satisfactorio.

Fueron munchos los retos que se presentaron durante el desarrollo e implementación, uno de ellos tuvo que ver con la obtención del consolidado del puntaje de todos los apostadores, inicialmente esos calculos se hacia cada vez que un usuario los solicitaba, en heroku el tiempo de calculo era prudente, pero en las otras nubes fue realemnte desastrozos (con tiempos de hasta 70 segundos para el calculo de los resultados consolidados), lo que se hizo entonces fue hacer otra implementación la cual consiste en que solo el admin realice la petición de calculos consolidados y estos se actualizan en cada user, posteriormente fue mas optimizado simpemente hacer la consulta de esos consolidados ya calculados. 

## To do refactoring and optimizated
Algunos elementos no necesariamente visuales que se pueden implementar en el futuro con el que se busca optmizar el código son:

-   Tener bien estructuradas las rutas tanto para ser usada como api, como las que permiten hacer el render del frontend. Recuarda que constantemente tuve que comentar unos u otras rutas para poder acceder desde postman, por que estaban destinadas para usarse desede el fronten, particualrmente bet-games y bet-classifications.

-   Revisar con calma como llevar algunos controladores, especialemnete los encargados del render del frontend en otra carpata de desarrollo.

***

# Historia de versiones
Se hace lanzamiento al público por primera vez de la app-polla el domingo 13 de noviembre de 2022!!!

## Version 1.0.0 (13.11.22)
- Sistema de logueo, apuesta, y puntaje funcional
- API funcional

## Version 1.1.0 (20.11.22)
- Menú superior con íconos
- Permite la configuración de la visibilidad de botones (ver apuesta de otros jugadores, boton registro), ademas de permitir o no de realizar mas apuestas (config.js)
- Implementación de verificador via postman de cuales apuestas no estan completamente diligenciada para la ronda de grupos


## Version 1.1.1 (21.11.22)
- Pequeñas mdificaciones de estilo y colores en los reportes de resultados total
- Se muestra la fecha y hora de cada juego

## Version 1.1.2 (30.12.22)
- Se implementa una ruta para crear un usuario admin, protegido con palabra clave en variable de entorono
- Se deja en firme la actual documentación

## Version 2.0.0 (12.04.26)
- IMPORTANTE: Esta versión deja funcional el nuevo sistema del mundial con 48 equipos y una etapa adicional en los partidos de fase
- Cambios significativos en el frontend y sistema de puntuación
- Sistema de puntaje de las clasificaciones: se dan 5 puntos por la coincidencia por la  clasificación en la etapa de grupo, tomando en cuenta los 4 equipos en su estricto orden. (5 puntos por cada equipo concidente en cada clasificacion de grupo)
- Se dan 10 puntos por la coincidencia por la  clasificación final, tomando en cuenta los 4 equipos en su estricto orden. (10 puntos por cada equipo coincidente en la clasificación final)
- Cambios IMPORTANTES EN EL FRONTEND QUE INCLUYE
    - Panel de administración para la gestión de equipos, partidos, clasificaciones, llaves para usuarios, gestion de usuarios, verificación de estado de las apuestas
    - Temporizadores de inicio de torneo y cierre de apuestas.
    - Usuario ve la cantidad de apuestas sin realizar
***

# Pasos para el correcto funcionamiento de la configuración del torneo

1. Crear el usuario admin (tener en cuenta la variable de entorno KEY_ADMIN, cuyo valor debe usarse como Key al momento de crear el usuario )
2. Ingresar todos los equipos del torneo
3. Ingresar TODOS LOS JUEGOS DEL TORNEO, incluyendo el juego fantasma. Desde los juegos por fases, colocar equipos genericos.
4. Ingresar TODAS LAS CLASIFICACIONES de manera generica, incluyendo la de la final
5. Generar llaves para creacion de usuarios
6. Tener apagada el menu de apuestas de fase, dado que al inicio solo se apuesta por grupos
7. Invitar a los usuarios que creen las apuestas de juegos por grupos y clasificaciones (encender apuestas)
8. Terminada la fase de apuesta de grupos apagar boton de apuestas de cada juego y de la clasificacion y activar (ver apuestas de otros jugadores de los juegos y de la clasificación)
9. IMPORTANTE: Ir calculando los puntajes totales despues de cada juego (updatepoint) 
10. Terminada la fase de grupos, llenar los juegos de 16 avos
11. Activar el menu de apuestas por fases
12. Invitar a los usuarios hacer la apuesta hasta el final
13. El admon debe ir diligenciando los partidos con sus resultados
14. Actualizar resultados (updatepoint)
15. Admon llena clasificaicon final real
16. Admon debe diligenciar el juego fantasma con los ganadores del partido de 3 y 4 puesto y el de final para el calculo de los 3 puntos que da acertar el ganador.

Aspectos importantes
Los apostadores no pueden ingresar a la apuesta de los 16 avos, hasta que el administrador no haya ingresado los juegos reales que se van a dar en esa fase. Por lo tanto la opción debe estar deshabilitada

Debo crear igualmente el juego virtual y marcarlo como el juego total mas 1

# TODO 2026

Se da inicio a una serie de modificaiones, esto se trabaja en la rama lab, la rama de despliegue es ia-dev




## TODO Prioritarios 
Atender antes de desplegar

- Documentacion del uso de compass
- Documentacion de la implementacion de notoficaciones
- Documentacion del despliegue
- Documentacion del uso de exappy con cloudflare
- Los partidos en la ronda fases marcado con 0 al inicio no permite poner la tarjeta en verde
- Implementar agrupar los dos partidos consecutivos para entender que de estos sale una llave
- Arreglar la visualizacion de algunas sub pantallas
- Mensaje de notificacion enviada
- tamaño de las banderas del campeon y cuarto puesto de la vista de clasificación
 Marcar en la ronda de fase no la palabra Ganador, sino .. mas bien. Elige quien clasifica
-El boton de ver apuestas de otros jugadores y el boton de ver otras clasificaciones, al parecer tiene un anchor que (necesario para las apuestas) pues devuelve la pantalla. revisar.
_ implementar una vista desplegable para las tarjetas de puntaje de juego para que se vea menos atosigado
- Organizar la bandera de republica del conngo
- No está eliminado los Game (lo intente con el ultimo) como no lo habia intentado entonces esta funcionalidad no se habia verificado. HACER ESTO DE ULTIMAS PARA NO DAÑAR LA ESTRUCTURA DE JUEGOS Y APUESTAS Y SEGUIR HACIENDO OTRAS PRUEBAS

## TODO mediano plazo
- ALGUNAS ESTATICAS 
   - TOTAL PARTIDOS JUGADOS, CUANTOS EMPATES, CUANTOS TRIUNFOS
   - TOTAL 5 PUNTOS OBTENIDOS/POSIBLES POR TODOS LOS JUGADORES
   - TOTAL DE APUESTAS ACERTADAS HASTA EL MOMENTO POR JUGADOR
   - TOTAL DE PARTIDOS PERMANECIENDO EN EL PUESTO 1, PUESTO 2 Y PUESTO 3
- Implementar que al eliminar un usuario se eliminen tambien todos los datos asocioados a sus apuestas por juegos y clasificaciones
- En la pantalla de gestionar juegos, que ademas de mantener la vsita actual se pueda ver la descripcion del juego, el cual se guarda de description.
- En el manual de usuario o en el lugar que se considere pertinente, dejar detallado que los perdedores de las semifinales conforman el partido de 3 y 4 puesto (eso causó confusión)
- Posibilidad de foto o avatar para cada usuario.
- Revisar banderas (NO SE VEN EN LA VISTA DE CLASIFICACIONES DETALLADO EN EL CELULAR) de Qtar, EEUU, Gales, Francia, Costa rica, Belgica, Siuza, Ghana
- Persitencia de los datos diligenciados en el formulario de registro cuando no se colocan datos válidos y aevitar así reescribir todo
- Sistema de recuperación de contraseña por parte del jugador
- sistema de notificación push cuando un juego o clasificación se ha cargado
- Permitir ordenar el consolidado de puntajes de mayor a menor o viceversa.
- Notificacion de los partidos del dia, o que estos se vean en la pantalla de inicio justo despues del lógin
- Sistema de envio automatico por correo electrónico o whatsappp la key que permite el registro de un usuario nuevo
- Automatización del registro de los resultados conectando la app con una api que entregue los resultados en tiempo real
-   En el consolidado de puntajes en total tener el puntaje alcanzado/total posible (incluso esto puede luego traducirse en un % de rendimiento)
-   En el detalle de las apuestas de un juego de ocatavo a finales (apuestas del juego), debe mostrarse, cual fue el equipo que se eligió como ganador y que pasa a la siguiente ronda

## TODO ATENDIDO
- 01.04.2026: Desarrollo de un frontend completo para el admin
- 10.04.2026: Sistema de colores en la tarjeta del juego de tal manera que adquiera un color, por ejemplo rojo, cuando 
este se le ha diligenciado los resulyatdos y por lo tanto se ha jugado.
- 10:04.2026: Sistema de aviso que informe al jugador cuantos juegos o clasificaciones tiene sin diligenciar
- 13.04.2026: Diseño de cronometro que indique el tiempo faltante para el cierre de las apuestas
- 13.04.2026: Cronometro de inicio de torneo
- Visualización del puntaje de CADA UNO de los juego syclasificaciones por usuario m y que los demás usuarios puedan ver el de cualquier usuario. (Verificar).
- 15.04.2026: Implementar el tema oscuro
- 16:04.2026 poner un ordenador de datos en los game de la vista del admin (organizar por fecha, por # de partido, por estado jugado o no)
- 16.04.2026: Modificar el modelo game para incluir dateGame, hourGame y placeGame de tal manera que estos parametros puedan ser usados por ejemplo en la busqueda de los juegos de una fecha determinada.
- 16.04.2026: Implementar en la pantalla principal los juegos del dia y los próximos juegos
- 27.04.2026: Se implementa un landigpage con información de las reglas de juego
- 17.04.2026 se implementa colores es y tamaños en los resultados por partidos y se añade una tarjeta con lo equipos en cada grupos

# Apuntes técnicos para este y otros proyectos
## Fase de despliegue
## EXPORTACION DE BD
Cuando se desarrolla en local la base de datos tambien es en local, llevar esa base de datos a la nube, en este caso a mongo atlas se siguien los siguientes pasos

1. EXPORTAR la base de datos LOCAL 
$ mongodump --db [name database]
(esto me genera una carpeta dump y por dentro la carpeta con la base de datos exportada)
(Se debe tener descargado mongodump.exe y prendido el servicio de la base de datos con mongod)

2. EXPORTAR base de datos de CLOUD
(Toda la BD)
$ mongodump --uri mongodb+srv://<USER>:<PASSWORD>@mongo-cluster.h360t.mongodb.net/<DATABASE>


(Una colección)
$ mongoexport --uri mongodb+srv://<USER>:<PASSWORD>@mongo-cluster.h360t.mongodb.net/<DATABASE> --collection <COLLECTION> --type <FILETYPE> --out <FILENAME>
(Filetype normalmente json)


## IMPORTACION DE BD

3. IMPORTAR base de datos en LOCAL
(todas las colecciones que estan dump)
$ mongorestore --[como la quiero llamar]

(Una coleccion en particular)
$ mongorestore --db [como la quiero llamar] --collection [como la quiero llamar] dump/collection.bson

4. IMPORTAR base de datos en CLOUD
(Lee la BD de la carpeta dump, por eso la bd quedará con el nombre de la carpeta dentro de dump, se ejecuta desde un nivel fuera de dump)
$ mongorestore --uri "mongodb+srv://<USER>:<PASSWORD>@mongo-cluster.h360t.mongodb.net/<DB-NAME>"


## Despliegue
Para el despluegue se adquiere un pequeño servidor (droplet) de digital Ocean y un dominio maolink.co, todo lo relacionado al despliegue se realizó con base al [video de fazt - creando tu propio heroku con Caprover](https://www.youtube.com/watch?v=MNKBJXiD1Ls&t=676s)

## Despliegue en Heroku (YA HEROKU NO ES FREE)
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


## Uso de dominios personales
Durante el despliegue y segun la plataforma hay que enlazar el dominio que entrega la plataforma de despliegue con un dominio personal (si se ha adquirido)
Este por ejemplo es el paso a paso para enlazar el dominio 
polla2.up.railway.app --> exappy.com

## Test de tiempo y otros segun donde se despliegua
### Seenode + mongodb Atlas
En seenode se tiene usa la prueba gratuita por 7 dias


                            PC      Movil
Login                      5.17      5.03
Ingresar Apuestas          7.56      8.00 
Ingresar clasificacion     7.63      8.33
Ver puntaje propio         31.54     31.35
Ver puntaje otros jugadores 3.72     4.38


### Despliegue local + mongoDb Atlas
                            PC      Movil
Login                       4.35     3.91
Ingresar Apuestas           6.28     6.29
Ingresar clasificacion      5.90     6.49
Ver puntaje propio          27.10    26.86
Ver puntaje otros jugadores 2.91     2.90

estoa es para el despliegue


Nota: El commit anterior al actual (es decir el commit anterior tiene el nombre 15.06.2026 2245) se considera el commit mas estable de la version de la polla, en caso de que en adelante enconremos errores volver a ese commit.

Lo que que viene en adelante es el merge que se hizo con la rama lab, donde he implementado lo siguiente
.
Nombres y banderas de cada grupo (para mejor identificacion)
Se mejora la tarjeta de los resultados
Se ha implementado notificaciones, aunque no es funcional 100%

## Maolink Software
Diciembre 30 2022