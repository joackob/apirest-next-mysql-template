import { App } from "../lib/index";

const app = new App();
const dataToTest: {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
} = {
  id: 1,
  nombre: "Juan",
  apellido: "Suarez",
  email: "jsuarez@etec.uba.ar",
};

describe("Testing CRUD operations in repoAdmins", () => {
  beforeAll(async () => {
    const admin = await app.saveAdmin({
      nombre: dataToTest.nombre,
      apellido: dataToTest.apellido,
      email: dataToTest.email,
    });
    dataToTest.id = admin.id;
  });

  afterAll(async () => {
    return app.destroy();
  });

  test("Deberia poder encontrar un admin por su id", async () => {
    const adminFound = await app.findAdmin({ id: dataToTest.id });
    expect(adminFound?.email).toEqual(dataToTest.email);
  });

  test("Deberia actualizar un admin según su id", async () => {
    await app.updateAdmin({
      id: dataToTest.id,
      nombre: "Jose",
    });
    const newAdmin = await app.findAdmin({ id: dataToTest.id });
    expect(newAdmin?.nombre).toEqual("Jose");
  });

  test("Deberia actualizar el nombre segun su id", async () => {
    const res = await app.updateAdmin({
      id: dataToTest.id,
      nombre: "Jose",
    });
    expect(res.affected).toBeTruthy();
  });

  test("Deberia eliminarse el admin segun su id", async () => {
    const res = await app.deleteAdmin({ id: dataToTest.id });
    expect(res.affected).toBeTruthy();
  });
});
