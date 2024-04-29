import { addSession } from "../../api/controllers/sessionController";
import Session from "../../api/models/classSessionsModel";

jest.mock("../../api/models/classSessionsModel");

describe("addSession", () => {
  const req = {
    body: {
      sessionName: "Session 1",
      course: "CS101",
      faculty: "John Doe",
      startTime: "2024-06-20T05:00:00.000Z",
      endTime: "2024-06-20T05:00:00.000Z",
      location: "Room 101",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  res.status.mockClear();
  res.json.mockClear();

  it("should add a new session and return 201 status code", async () => {
    Session.mockImplementationOnce(() => ({
      save: jest.fn().mockResolvedValueOnce(),
    }));

    await addSession(req, res);

    expect(Session).toHaveBeenCalledWith({
      sessionName: "Session 1",
      course: "CS101",
      faculty: "John Doe",
      startTime: "10:30 AM",
      endTime: "10:30 AM",
      location: "Room 101",
    });

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should return 500 status code and error message if session save fails", async () => {
    Session.mockImplementationOnce(() => ({
      save: jest.fn().mockRejectedValueOnce(new Error("Save failed")),
    }));

    await addSession(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Could not add session." });
  });
});
