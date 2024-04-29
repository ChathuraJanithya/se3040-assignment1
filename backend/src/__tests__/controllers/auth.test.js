import { signup, login } from "../../api/controllers/userController";
import User from "../../api/models/userModel";

jest.mock("../../api/models/userModel");
const req = {
  body: {
    email: "adminChathura",
    password: "admin",
    firstName: "chathura",
    lastName: "janithya",
    contact: "0712150138",
    role: "admin",
  },
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
// Clear mocks before calling the signup function
res.status.mockClear();
res.json.mockClear();

it("should send a status code of 400 when user already exists ", async () => {
  User.findOne.mockImplementationOnce(() => ({
    email: "adminChathura",
    password: "admin",
    firstName: "chathura",
    lastName: "janithya",
    contact: "0712150138",
    role: "admin",
  }));
  await signup(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
});

it("should send a status code of 500 when user doesn't created ", async () => {
  User.findOne.mockResolvedValueOnce(null);
  User.mockImplementationOnce(() => ({
    save: jest.fn().mockResolvedValueOnce(),
  }));
  await signup(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
});
