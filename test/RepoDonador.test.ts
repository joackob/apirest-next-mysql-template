import { RepoDonadores } from "../lib/RepoDonador";

describe("Testing CRUD operations in RepoDonadores", () => {
  const repo = new RepoDonadores();
  const dataToTest: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  } = {
    id: "1",
    nombre: "Juan",
    apellido: "Suarez",
    email: "jsuarez@etec.uba.ar",
    telefono: "1112345678",
  };

  beforeAll(async () => {
    const dono = await repo.save({
      nombre: dataToTest.nombre,
      apellido: dataToTest.apellido,
      email: dataToTest.email,
      telefono: dataToTest.telefono,
    });
    dataToTest.id = dono.id;
  });

  afterAll(async () => {
    return repo.destroy();
  });

  test("Deberia poder encontrar un donador por su id", async () => {
    const dono = await repo.find({ id: dataToTest.id });
    expect(dono?.email).toEqual(dataToTest.email);
  });

  test("Deberia actualizar un donador según su id", async () => {
    await repo.update({
      id: dataToTest.id,
      nombre: "Jose",
    });
    const dono = await repo.find({ id: dataToTest.id });
    expect(dono?.nombre).toEqual("Jose");
  });

  test("Deberia actualizar el nombre segun su id", async () => {
    const res = await repo.update({
      id: dataToTest.id,
      nombre: "Jose",
    });
    expect(res.affected).toBeTruthy();
  });

  test("Deberia eliminarse el donador segun su id", async () => {
    const res = await repo.delete({ id: dataToTest.id });
    expect(res.affected).toBeTruthy();
  });
});
