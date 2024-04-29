import {
  addCourse,
  removeCourse,
} from "../../api/controllers/courseController";
import Course from "../../api/models/courseModel";

jest.mock("../../api/models/courseModel");

describe("addCourse", () => {
  const mockRequest = {
    body: {
      courseName: "Introduction to Computer Science",
      courseCode: "CS101",
      courseCredit: 3,
      faculty: "Faculty of Computing",
    },
    role: "admin",
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

  it("should return 403 if user is not an admin", async () => {
    const req = { ...mockRequest, role: "student" };
    const res = mockResponse();

    await addCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });
});

describe("removeCourse", () => {
  const mockRequest = {
    role: "admin",
    params: {
      id: "1234",
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

  it("should return 403 if user is not an admin", async () => {
    const req = { ...mockRequest, role: "student" };
    const res = mockResponse();

    await removeCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("should return 404 if course not found", async () => {
    const req = mockRequest;
    const res = mockResponse();
    Course.findById.mockResolvedValueOnce(null);

    await removeCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Course not found" });
  });

  it("should remove the course and return 200", async () => {
    const req = mockRequest;
    const res = mockResponse();
    const mockCourse = { _id: "1234" };
    Course.findById.mockResolvedValueOnce(mockCourse);
    Course.findByIdAndDelete.mockResolvedValueOnce();

    await removeCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Course removed successfully.",
    });
    expect(Course.findByIdAndDelete).toHaveBeenCalledWith("1234");
  });
});
