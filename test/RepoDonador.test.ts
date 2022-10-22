import { RepoDonadores } from "../lib/RepoDonadores";

describe("Testing CRUD operations in RepoDonadores", () => {
  const repo = new RepoDonadores();
  const dataToTest: {
    id: string;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
  } = {
    id: "1",
    nombre: "Juan",
    apellido: "Suarez",
    dni: "30123456",
    email: "jsuarez@etec.uba.ar",
    telefono: "1112345678",
  };

  beforeAll(async () => {
    const dono = await repo.save({
      nombre: dataToTest.nombre,
      apellido: dataToTest.apellido,
      dni: dataToTest.dni,
      email: dataToTest.email,
      telefono: dataToTest.telefono,
    });
    dataToTest.id = dono.id;
  });

  afterAll(async () => {
    return repo.destroy();
  });

  test("Deberia poder encontrar un donador por su id", async () => {
    const dono = await repo.findByID({ id: dataToTest.id });
    expect(dono?.email).toEqual(dataToTest.email);
  });

  test("Deberia actualizar un donador según su id", async () => {
    await repo.updateByID({
      id: dataToTest.id,
      nombre: "Jose",
    });
    const dono = await repo.findByID({ id: dataToTest.id });
    expect(dono?.nombre).toEqual("Jose");
  });

  test("Deberia actualizar el nombre segun su id", async () => {
    const res = await repo.updateByID({
      id: dataToTest.id,
      nombre: "Jose",
    });
    expect(res.wasUpdated).toBeTruthy();
  });

  test("Deberia eliminarse el donador segun su id", async () => {
    const res = await repo.deleteByID({ id: dataToTest.id });
    expect(res.wasRemoved).toBeTruthy();
  });
});
