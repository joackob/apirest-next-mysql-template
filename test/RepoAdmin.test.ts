import { RepoAdmin } from "../lib/RepoAdmin";

describe("Testing CRUD operations in repoAdmins", () => {
  const repo = new RepoAdmin();
  const dataToTest: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  } = {
    id: "1",
    nombre: "Juan",
    apellido: "Suarez",
    email: "jsuarez@etec.uba.ar",
  };

  beforeAll(async () => {
    const admin = await repo.save({
      nombre: dataToTest.nombre,
      apellido: dataToTest.apellido,
      email: dataToTest.email,
    });
    dataToTest.id = admin.id;
  });

  afterAll(async () => {
    return repo.destroy();
  });

  test("Deberia poder encontrar un admin por su id", async () => {
    const admin = await repo.find({ id: dataToTest.id });
    expect(admin?.email).toEqual(dataToTest.email);
  });

  test("Deberia actualizar un admin según su id", async () => {
    await repo.update({
      id: dataToTest.id,
      nombre: "Jose",
    });
    const admin = await repo.find({ id: dataToTest.id });
    expect(admin?.nombre).toEqual("Jose");
  });

  test("Deberia actualizar el nombre segun su id", async () => {
    const res = await repo.update({
      id: dataToTest.id,
      nombre: "Jose",
    });
    expect(res.affected).toBeTruthy();
  });

  test("Deberia eliminarse el admin segun su id", async () => {
    const res = await repo.delete({ id: dataToTest.id });
    expect(res.affected).toBeTruthy();
  });
});
