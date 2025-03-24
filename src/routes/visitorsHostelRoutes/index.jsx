// export const host = "http://127.0.0.1:8000";
import { host } from "../globalRoutes";

export const fetchAvailableRoomsRoute = `${host}/visitorhostel/room_availabity_new/`;
export const confirmBookingRoute = `${host}/visitorhostel/confirm-booking-new/`;
export const fetchCompletedBookingsRoute = `${host}/visitorhostel/completed-bookings/`;
export const fetchCancelledBookingsRoute = `${host}/visitorhostel/get-inactive-bookings/`;
export const fetchBookingsRoute = `${host}/visitorhostel/get-booking-requests/`;
export const requestBookingRoute = `${host}/visitorhostel/request-booking/`;
export const addInventoryRoute = `${host}/visitorhostel/api/inventory_add/`;
export const getActiveBookingsRoute = `${host}/visitorhostel/get-active-bookings/`;
export const cancelBookingRoute = `${host}/visitorhostel/cancel-booking/`;
export const fetchIncomeDataRoute = `${host}/visitorhostel/accounts-income/`;
export const addItemsRoute = `${host}/visitorhostel/api/inventory_add/`;
export const fetchInventorydataRoute = `${host}/visitorhostel/api/inventory_list/`;
export const fetchPartialBookingdataRoute = `${host}/visitorhostel/check-partial-booking/`;
