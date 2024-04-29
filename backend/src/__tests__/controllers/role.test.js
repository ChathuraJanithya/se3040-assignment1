import { addRole } from "../../api/controllers/roleController";
import Role from "../../api/models/roleModel";

jest.mock("../../api/models/roleModel");

describe("addRole", () => {
  const mockRequest = {
    body: {
      roleName: "Admin",
      roleDescription: "User with administrative privileges",
    },
  };

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if role already exists", async () => {
    const req = mockRequest;
    const res = mockResponse();
    Role.findOne.mockResolvedValueOnce({
      roleName: "Admin",
      roleDescription: "User with administrative privileges",
    });

    await addRole(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Role already exists" });
  });

  it("should create a new role and return 201", async () => {
    const req = mockRequest;
    const res = mockResponse();
    Role.findOne.mockResolvedValueOnce(null);
    const mockSave = jest.fn();
    Role.mockImplementationOnce(() => ({
      save: mockSave,
    }));

    await addRole(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(mockSave).toHaveBeenCalled();
  });

  it("should return 500 if an error occurs", async () => {
    const req = mockRequest;
    const res = mockResponse();
    const mockError = new Error("Something went wrong");
    Role.findOne.mockRejectedValueOnce(mockError);

    await addRole(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Could not add role" });
  });
});
