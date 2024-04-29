import { addBooking } from "../../api/controllers/bookingController";
import Booking from "../../api/models/bookingModel";
import moment from "moment";

jest.mock("../../api/models/bookingModel");
jest.mock("moment", () => () => ({
  format: jest.fn((format) => (format === "LT" ? "10:00" : "12:00")),
}));

describe("addBooking", () => {
  const mockRequest = {
    body: {
      roomID: "room1",
      resourceID: "resource1",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      reservedDate: "2023-05-01",
      status: "pending",
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

  it("should return 401 if booking overlaps with existing booking", async () => {
    const req = mockRequest;
    const res = mockResponse();
    Booking.findOne.mockResolvedValueOnce({
      roomID: "room1",
      resourceID: "resource1",
      reservedDate: "2023-05-01",
      startTime: "09:00",
      endTime: "11:00",
    });

    await addBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should create a new booking and return 201", async () => {
    const req = mockRequest;
    const res = mockResponse();
    Booking.findOne.mockResolvedValueOnce(null);
    const mockSave = jest.fn();
    Booking.mockImplementationOnce(() => ({
      save: mockSave,
    }));

    await addBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(mockSave).toHaveBeenCalled();
  });

  it("should return 500 if an error occurs", async () => {
    const req = mockRequest;
    const res = mockResponse();
    const mockError = new Error("Something went wrong");
    Booking.findOne.mockRejectedValueOnce(mockError);

    await addBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Booking failed",
      error: mockError.message,
    });
  });
});
