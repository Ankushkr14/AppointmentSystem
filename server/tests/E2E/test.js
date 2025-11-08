import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({
    quiet: true
});

const BASE_URL = 'http://localhost:5000';
const API_PREFIX = '/api/v1';

const studentA1 = {
    name: 'Student A1',
    username: 'stud001',
    email: 'stud001@college.edu',
    password: 'password',
    role: 'student'
};

const studentA2 = {
    name: 'Student A2',
    username: 'stud002',
    email: 'stud002@college.edu',
    password: 'password',
    role: 'student'
};

const professorP1 = {
    name: 'Professor P1',
    username: 'prof001',
    email: 'prof001@college.edu',
    password: 'password',
    role: 'professor'
};

const getUserFromToken = (token) => {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = { id: decoded.id, role: decoded.role}
    return user;
}

let studentA1Token;
let studentA2Token;
let professorP1Token;
let professorP1Id;
let availabilityId;
let timeSlot1Id;
let timeSlot2Id;
let appointmentA1Id;
let appointmentA2Id;

describe('E2E Appointment system test', () => {

    beforeAll(async () => {
        await mongoose.connect(process.env.TEST_DATABASE);
        await mongoose.connection.db.dropDatabase();
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    //Authentication Test - Student A1
    describe('Student A1 authenticates to access the system', () => {
        it('Register: student A1 success', async () => {
            const response = await request(BASE_URL)
                .post(`${API_PREFIX}/auth/register`)
                .send(studentA1)
                .expect(201);
            
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
        });

        it('Login: student A1 success', async () => {
            const response = await request(BASE_URL)
                .post(`${API_PREFIX}/auth/login`)
                .send({
                    username: studentA1.username,
                    password: studentA1.password
                })
                .expect(200);
            
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
            studentA1Token = response.body.token;
        });
    });

    //Authentication Test - Student A2
    describe('Student A2 authenticates to access the system', () => {
        it('Register: student A2 success', async () => {
            const response = await request(BASE_URL)
                .post(`${API_PREFIX}/auth/register`)
                .send(studentA2)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
        });

        it('Login: student A2 success', async () => {
            const response = await request(BASE_URL)
                .post(`${API_PREFIX}/auth/login`)
                .send({
                    username: studentA2.username,
                    password: studentA2.password
                })
                .expect(200);
            
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
            studentA2Token = response.body.token;
        });
    });

    //Authentication Test - Professor P1
    describe('Professor P1 authenticates to access the system', () => {
        it('Register: Professor P1 success', async () => {
            const response = await request(BASE_URL)
                .post(`${API_PREFIX}/auth/register`)
                .send(professorP1)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('User registered successfully');
            expect(response.body.token).toBeDefined();
        });

        it('Login: Professor P1 success', async () => {
            const response = await request(BASE_URL)
                .post(`${API_PREFIX}/auth/login`)
                .send({
                    username: professorP1.username,
                    password: professorP1.password
                })
                .expect(200);
            
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
            professorP1Token = response.body.token;

            professorP1Id = getUserFromToken(professorP1Token).id;
            expect(professorP1Id).toBeDefined();
        });
    });

    //Availability Update: add time slots
    describe('Professor P1 add available time slots', () => {
        it('Add available time slots for Professor P1', async () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate()+1);
            tomorrow.setHours(0, 0, 0, 0);

            const timeSlot1 = new Date(tomorrow);
            timeSlot1.setHours(10, 0, 0, 0);

            const timeSlot2 = new Date(tomorrow);
            timeSlot2.setHours(11, 0, 0, 0);

            const response = await request(BASE_URL)
                .post(`${API_PREFIX}/availability/slots`)
                .set('Authorization', `Bearer ${professorP1Token}`)
                .send({
                    date: tomorrow.toISOString(),
                    timeSlots: [
                        { startTime: timeSlot1.toISOString(), isBooked: false },
                        { startTime: timeSlot2.toISOString(), isBooked: false }
                    ]
                })
                .expect(201);
            
            expect(response.body.success).toBe(true);
        });
    });

    //User: Fetch professor list
    describe('Student fetch the list of professor', () => {
        it('Get the professor list', async () => {
            const response = await request(BASE_URL)
                .get(`${API_PREFIX}/user/professors`)
                .set('Authorization', `Bearer ${studentA1Token}`)
                .expect(200)

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        })
    })

    //Availability Fetch: get available slots
    describe('Student A1 views available time slots for Professor P1', () => {
        it('View time slots for Professor P1', async () => {
            const response = await request(BASE_URL)
                .get(`${API_PREFIX}/availability/${professorP1Id}`)
                .set('Authorization', `Bearer ${studentA1Token}`)
                .expect(200);
            
            expect(response.body.success).toBe(true);
            expect(response.body.availability).toBeDefined();
            expect(Array.isArray(response.body.availability)).toBe(true);
            
            const availability = response.body.availability[0];
            availabilityId = availability._id;
            
            const availableSlots = availability.timeSlots.filter(slot => !slot.isBooked);
            expect(availableSlots.length).toBeGreaterThanOrEqual(2);
            
            timeSlot1Id = availableSlots[0]._id
            timeSlot2Id = availableSlots[1]._id
        });
    });

    //Book appointment: Student A1 book for timeslot1
    describe('Student A1 books an appointment with professor P1', () => {
        it('book appointment successfully for student A1', async () => {
            const response = await request(BASE_URL)
                .post(`${API_PREFIX}/appointment/book`)
                .set('Authorization', `Bearer ${studentA1Token}`)
                .send({
                    professorId: professorP1Id,
                    availabilityId: availabilityId,
                    timeSlotId: timeSlot1Id,
                    notes: 'Discussing project proposal'
                })
                .expect(200)
            
            expect(response.body.success).toBe(true);
            appointmentA1Id = response.body.data?._id;
        });
    });

    //Book appointment: Student A2 book for timeslot2
    describe('Student A2 books an appointment with professor P2', () => {
        it('book appointment successfully for student A2', async () => {
            const response = await request(BASE_URL)
                .post(`${API_PREFIX}/appointment/book`)
                .set('Authorization', `Bearer ${studentA2Token}`)
                .send({
                    professorId: professorP1Id,
                    availabilityId: availabilityId,
                    timeSlotId: timeSlot2Id,
                    notes: 'Clarifying doubts about assignments'
                })
                .expect(200)
            
            expect(response.body.success).toBe(true);
            appointmentA2Id = response.body.data?._id;
        });
    });

    //Appointment Update: Cancel Appointment 
    describe('Professor P1 cancel the appointment for Student A1', () => {
        it('appointment cancelled successfully', async () => {
            const response = await request(BASE_URL)
                .put(`${API_PREFIX}/appointment/cancel/${appointmentA1Id}`)
                .set('Authorization', `Bearer ${professorP1Token}`)
                .expect(201);

            expect(response.body.success).toBe(true);
        });
    });

    //Student A1 check for appointment 
    describe('Student A1 checks appointments and has no pending appointments', () => {
        it('get appointments for Student A1', async () => {
            const response = await request(BASE_URL)
                .get(`${API_PREFIX}/appointment`)
                .set('Authorization', `Bearer ${studentA1Token}`)
                .query({ status: 'booked' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.appointments).toBeDefined();

            const pendingAppointments = response.body.appointments.filter(
                apt => apt.status === 'booked'
            );
            expect(pendingAppointments.length).toBe(0);
        });

        it('verify Student A1 has a cancelled appointment', async () => {
            const response = await request(BASE_URL)
                .get(`${API_PREFIX}/appointment`)
                .set('Authorization', `Bearer ${studentA1Token}`)
                .query({ status: 'cancelled' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.appointments).toBeDefined();

            const cancelledAppointments = response.body.appointments.filter(
                apt => apt.status === 'cancelled'
            );
            expect(cancelledAppointments.length).toBe(1);
        });
    });

    //Student A2 check for appointment 
    describe('Student A2 check their appointment', () => {
        it('verify Student A2 still has their pending appointment', async () => {
            const response = await request(BASE_URL)
                .get(`${API_PREFIX}/appointment`)
                .set('Authorization', `Bearer ${studentA2Token}`)
                .query({ status: 'booked' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.appointments).toBeDefined();

            const pendingAppointments = response.body.appointments.filter(
                apt => apt.status === 'booked'
            );
            expect(pendingAppointments.length).toBe(1);
            expect(pendingAppointments[0]._id).toBe(appointmentA2Id);
        });
    });

    //Appointment Update: Professor mark completed
    describe('Professor P1 mark completed for appoitment', () => {
        it('appoinment marked completed', async () => {
            const response = await request(BASE_URL)
                .put(`${API_PREFIX}/appointment/complete/${appointmentA2Id}`)
                .set('Authorization', `Bearer ${professorP1Token}`)
                .expect(200)
            
            expect(response.body.success).toBe(true);
        });
    });
})