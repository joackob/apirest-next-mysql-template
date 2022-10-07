import { RepoTurnos } from "../lib/RepoTurnos";
import { RepoDonadores } from "../lib/RepoDonadores";

describe("Testing CRUD operations in RepoDonadores", () => {
  const repoTurns = new RepoTurnos();
  const repoDonors = new RepoDonadores();
  const today = new Date();
  const dataToTest: {
    idTurn?: string;
    fecha: Date;
    idDono?: string;
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
    dataToTest.idTurn = result.turnID;
    dataToTest.idDono = result.donorID;
  });

  afterAll(async () => {
    await repoDonors.destroy();
    return repoTurns.destroy();
  });

  test("Deberia existir un donador asociado a un turno", async () => {
    const donor = await repoDonors.findByID({ id: dataToTest.idDono ?? "" });
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
});
