import { App } from "../lib/index";

const app = new App();

afterAll(async () => {
  app.destroy();
});

test("La base de datos esta conectada", async () => {
  await app.connectDataSource();
  expect(app.isInitialized).toBeTruthy();
});
test("Deberia existir un id que identifique al admin recien creado", async () => {
  const admin = await app.saveAdmin({
    nombre: "Juan",
    apellido: "Suarez",
    email: "jsuarez@etec.uba.ar",
  });

  expect(admin.id).toBeDefined();
});
