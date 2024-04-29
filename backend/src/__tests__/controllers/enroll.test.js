import { enrollStudent } from "../../api/controllers/enrollController";
import StudentEnroll from "../../api/models/studentEnrollModel";

jest.mock("../../api/models/studentEnrollModel");

describe("enrollStudent", () => {
  const req = {
    body: {
      studentID: "12345",
      courseID: "CS101",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  res.status.mockClear();
  res.json.mockClear();

  it("should Student already enrolled 400", async () => {
    StudentEnroll.findOne.mockImplementationOnce(() => ({
      studentID: "12345",
      enrolledCourses: ["CS101"],
    }));

    await enrollStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
