# API Rest with NextJS, TypeORM  and MySQL:writing_hand:

Este template fue creado para aprender sobre tecnologías backend. Posee un ejemplo y en este archivo se explicara el paso a paso de como fue su proceso de desarrollo.

## Entorno

Asegurarse de tener instalado `git` . Esto se puede revisar muy facilmente a trevez del comando `git --version` . En caso de no estar instalado, se puede hacer a travez de los siguientes paso

- En linux, a travez del comando `sudo apt install git`.
- En Windows, a travez de la pagina oficial https://git-scm.com/

Procurar tener actualizado `node.js` a la versión `lts`. Si desea asegurarse, puede ejecutar el comando `npm doctor` que le indicara si cumple con los requisitos. Si el comando no se encuentra o `node.js` esta desactualizado, puede instalar `node.js --lts` mediante alguno de los siguientes pasos

- En windows, desde la [pagina oficial](https://nodejs.org/en/), descargando y ejecutando la versión `lts`.

- En Linux, a través de [nvm](https://github.com/nvm-sh/nvm) 

  - Abrir una terminal y ejecutar el comando que se encuentra en la sección [Install & update script](https://github.com/nvm-sh/nvm#install--update-script)

  - Cerrar la terminal y abrir otra para ejecutar el siguiente comando para verificar la correcta instalación`nvm --version` . Una vez observada la versión, ejecutar el siguiente comando para instalar Node.js

    ```bash
    nvm install --lts
    ```


## Instalación y ejecución

- 🛠Para instalar las dependencias ejecutar el siguiente comando `npm install`
- ⚒Para ejecutar el modo playground o repl, ejecutar el siguiente comando `npm run dev`
- 🔧Para traducir el código en `/src` a `JavaScript` , usar el comando `npm run build`
- 🔑Para ejecutar el código con `Node.js`, usar el comando `npm run start`
- 🧪Para ejecutar los test con jest, usar el comando `npm run test`

## Variables de entorno

- `DBHOST`: Dirección donde esta localizado la base de datos, por defecto es “localhost”
- `DBUSER`: Usuario con permisos para acceder a la base de datos, por defecto es “root”
- `DBPORT`: Puerto para acceder a la base de datos, por defecto es “3306”
- `DBPASS`: Password o contraseña asociado al usuarios para acceder a la base de datos, por defecto es “password”
- `DB`: Nombre de la base de datos, por defecto es “test”. Recordar que esta base de datos debe ser creada antes de ejecutar la aplicación o los tests

Se puede usar el archivo `.env` para configurar estas variables de entorno en testing y desarrollo. Solo se debe ejecutar el comando `cp .env.example .env`.

## Características

- [TypeScript](https://www.typescriptlang.org/)
- [NextJS](https://nextjs.org/)
- [Jest](https://jestjs.io/)
- [TypeOrm](https://typeorm.io/)
- [Reflect-metadata](https://www.npmjs.com/package/reflect-metadata)

## Artículos y ejemplos  tomados en cuenta para el desarrollo del template

- [Dependency Injection with NextJS and TypeScript](https://himynameistim.com/blog/dependency-injection-with-nextjs-and-typescript)
- [Testing in NextJS](https://nextjs.org/docs/testing)
- [Example Next + Jest](https://github.com/vercel/next.js/tree/canary/examples/with-jest)

## Pasos para crear este template

Para aligerar la carga del trabajo, recomiendo usar el ejemplo que `NextJS` provee en su sitio oficial. Mediante el siguiente comando. 

```bash
npx create-next-app --example with-jest with-jest-app
```

Ya con esto, podemos contar con todos los beneficios de `Typescript` y `Testing` en `NextJS`

Dado que [TypeOrm](https://typeorm.io/) utiliza decoradores para trabajar, no esta de más empezar por configurar todo el entorno para ello. Y si de casualidad, usas inyección de dependencias, este [tutorial](https://himynameistim.com/blog/dependency-injection-with-nextjs-and-typescript) podría ser de mucha ayuda. Pero sino, simplemente instalamos `reflect-metadata`

```bash
npm install --save reflect-metadata
```

Agregamos las siguientes opciones al archivo `tsconfig.json`

```json
{
    "compilerOptions": {
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true
    }
}
```

Instalamos algunos paquetes que lidiaran con la resolución de decoradores en `NextJS`.

```bash
npm install -D @babel/core @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators babel-plugin-transform-typescript-metadata
```

Configuramos el archivo `.babelrc`. `NextJS` permite extender las funcionalidades mediante este archivo. Aquí un [tutorial](https://nextjs.org/docs/advanced-features/customizing-babel-config) por si te interesa el tema. Esto deshabilitara `swc` que es la plataforma de `nextjs` en versiones 12.3 en adelante. Por ende, cuando ejecutes el comando `npm run dev` es muy probable toparse con mensajes sobre este cambio. No asustarse.

```json
{
    "presets": ["next/babel"],
    "plugins": [
      "babel-plugin-transform-typescript-metadata",
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ]
}
```

En el archivo `_app.tsx` agregamos la siguiente sentencia al inicio del archivo

```
import "reflect-metadata"
```

Ahora, llego el momento de incluir [TypeORM](https://typeorm.io/) a nuestro proyecto. Esto lo hacemos con los siguientes comandos (en mi caso use `MySQL` pero podes elegir varias opciones)

```
npm install typeorm mysql2
```

Por último, un detalle. Por el momento, existe un [error](https://github.com/uuidjs/uuid/issues/451) al trabajar con `NextJS` y `Jest` que involucra a `uuid`, pero se soluciona rápidamente agregando el siguiente remapping manualmente en el archivo `jest.config.js`

```js
  moduleNameMapper: {
    "^uuid$": "uuid",
  },
```

En este mismo template existe un ejemplo sobre una forma de trabajar con [TypeORM](https://typeorm.io/). Se trata de un sistema para gestionar turnos de hospitales. 
