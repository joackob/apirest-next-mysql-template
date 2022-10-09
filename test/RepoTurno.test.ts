import { RepoTurnos } from "../lib/RepoTurnos";
import { RepoDonadores } from "../lib/RepoDonadores";

describe("Testing CRUD operations in RepoDonadores", () => {
  const repoTurns = new RepoTurnos();
  const repoDonors = new RepoDonadores();
  const today = new Date("8/10/2022 09:00:00");
  const dataToTest: {
    turnID?: string;
    fecha: Date;
    donorID?: string;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
  } = {
    fecha: today,
    nombre: "Jorge",
    apellido: "Lopez",
    dni: "30654321",
    email: "jlopez@etec.uba.ar",
    telefono: "1112345678",
  };

  beforeAll(async () => {
    const result = await repoTurns.reserve({
      nombre: dataToTest.nombre,
      apellido: dataToTest.apellido,
      dni: dataToTest.dni,
      email: dataToTest.email,
      telefono: dataToTest.telefono,
      fecha: dataToTest.fecha,
    });
    dataToTest.turnID = result.turnID;
    dataToTest.donorID = result.donorID;
  });

  afterAll(async () => {
    await repoDonors.destroy();
    return repoTurns.destroy();
  });

  test("Deberia existir un donador asociado a un turno", async () => {
    const donor = await repoDonors.findByID({ id: dataToTest.donorID ?? "" });
    expect(donor?.nombre).toEqual("Jorge");
  });

  test("Deberia existir al menos un turno reservado para hoy", async () => {
    const turns = await repoTurns.getBooked({ date: today });
    expect(turns?.length).toBeGreaterThanOrEqual(1);
  });

  test("Deberian existir mas de un turno disponible para hoy ", async () => {
    const turns = await repoTurns.getAvailable({ date: today });
    expect(turns?.length).toBeGreaterThanOrEqual(1);
  });

  test("Deberia poder encontrar un turno por su id", async () => {
    const turn = await repoTurns.findByID({ id: dataToTest.turnID ?? "" });
    expect(turn?.donador.id).toEqual(dataToTest.donorID);
  });

  test("Deberia actualizar el nombre segun su id", async () => {
    const res = await repoTurns.updateByID({
      id: dataToTest.turnID ?? "",
      date: new Date(),
    });
    expect(res.updated).toBeTruthy();
  });

  test("Deberia eliminarse un turno segun su id", async () => {
    const res = await repoTurns.deleteByID({ id: dataToTest.turnID ?? "" });
    expect(res.removed).toBeTruthy();
  });
});
