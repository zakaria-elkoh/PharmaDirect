import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Pharmacy } from './schemas/pharmacy.schema';
import { Review } from './schemas/review.schema';
import { Notification } from './notification/schema/notification.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class DatabaseSeeder {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Pharmacy.name) private pharmacyModel: Model<Pharmacy>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async seed() {
    await this.clearDatabase();
    const users = await this.seedUsers();
    const pharmacies = await this.seedPharmacies();
    await this.seedReviews(users, pharmacies);
    await this.seedNotifications(users, pharmacies);
    console.log('Database seeded successfully!');
  }

  private async clearDatabase() {
    await this.userModel.deleteMany({});
    await this.pharmacyModel.deleteMany({});
    await this.reviewModel.deleteMany({});
    await this.notificationModel.deleteMany({});
  }

  private async seedUsers(): Promise<User[]> {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await this.userModel.create([
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        lastLocation: {
          type: 'Point',
          coordinates: [2.3522, 48.8566], // Paris coordinates
        },
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        isVerified: true,
        lastLocation: {
          type: 'Point',
          coordinates: [2.3522, 48.8566],
        },
      },
    ]);

    return users;
  }

  private async seedPharmacies(): Promise<Pharmacy[]> {
    const pharmacies = await this.pharmacyModel.create([
      {
        _id: '677e5164f788ac95bd780dea',
        name: 'Pharmacie Al Massira',
        address: {
          street: 'Avenue Mohammed V',
          city: 'Youssoufia',
          state: 'Youssoufia',
          country: 'Morocco',
          postalCode: '46300',
        },
        detailedAddress: '123 Avenue Mohammed V, Youssoufia 46300',
        phone: '+212523490123',
        email: 'almassira@pharmacy.ma',
        openingHours: [
          { day: 'Monday', hours: '08:00-23:00' },
          { day: 'Tuesday', hours: '08:00-23:00' },
          { day: 'Wednesday', hours: '08:00-23:00' },
          { day: 'Thursday', hours: '08:00-23:00' },
          { day: 'Friday', hours: '08:00-23:00' },
          { day: 'Saturday', hours: '09:00-22:00' },
          { day: 'Sunday', hours: '09:00-22:00' },
        ],
        services: ['Prescription', 'Consultation', 'Vaccination'],
        imageMobile:
          'https://images.unsplash.com/photo-1586015555751-63c29b37efd5?ixlib=rb-4.0.3',
        isOnDuty: true,
        latitude: '32.2462',
        longitude: '-8.5298',
        rating: 4.5,
      },
      {
        _id: '677e5164f788ac95bd780de0',
        name: 'Pharmacie Atlas',
        address: {
          street: 'Rue Hassan II',
          city: 'Youssoufia',
          state: 'Youssoufia',
          country: 'Morocco',
          postalCode: '46300',
        },
        detailedAddress: '45 Rue Hassan II, Quartier Al Qods, Youssoufia 46300',
        phone: '+212523491234',
        email: 'atlas@pharmacy.ma',
        openingHours: [
          { day: 'Monday', hours: '08:30-22:00' },
          { day: 'Tuesday', hours: '08:30-22:00' },
          { day: 'Wednesday', hours: '08:30-22:00' },
          { day: 'Thursday', hours: '08:30-22:00' },
          { day: 'Friday', hours: '08:30-22:00' },
          { day: 'Saturday', hours: '09:00-21:00' },
          { day: 'Sunday', hours: '09:00-21:00' },
        ],
        services: ['Prescription', 'Beauty Products', 'Medical Equipment'],
        imageMobile:
          'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3',
        isOnDuty: false,
        latitude: '32.2429',
        longitude: '-8.5285',
        rating: 4.2,
      },
      {
        _id: '677e5164f788ac95bd780de1',
        name: 'Pharmacie Al Amal',
        address: {
          street: 'Boulevard Mohammed VI',
          city: 'Youssoufia',
          state: 'Youssoufia',
          country: 'Morocco',
          postalCode: '46300',
        },
        detailedAddress: '78 Boulevard Mohammed VI, Youssoufia 46300',
        phone: '+212523492345',
        email: 'alamal@pharmacy.ma',
        openingHours: [
          { day: 'Monday', hours: '08:00-22:30' },
          { day: 'Tuesday', hours: '08:00-22:30' },
          { day: 'Wednesday', hours: '08:00-22:30' },
          { day: 'Thursday', hours: '08:00-22:30' },
          { day: 'Friday', hours: '08:00-22:30' },
          { day: 'Saturday', hours: '09:00-21:30' },
          { day: 'Sunday', hours: '09:00-21:30' },
        ],
        services: ['Prescription', 'First Aid', 'Baby Care'],
        imageMobile:
          'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3',
        isOnDuty: true,
        latitude: '32.2445',
        longitude: '-8.5276',
        rating: 4.7,
      },
      {
        _id: '677e5164f788ac95bd780de2',
        name: 'Pharmacie Centrale Youssoufia',
        address: {
          street: 'Rue de la Mosquée',
          city: 'Youssoufia',
          state: 'Youssoufia',
          country: 'Morocco',
          postalCode: '46300',
        },
        detailedAddress: '15 Rue de la Mosquée, Centre Ville, Youssoufia 46300',
        phone: '+212523493456',
        email: 'centrale.youssoufia@pharmacy.ma',
        openingHours: [
          { day: 'Monday', hours: '08:30-23:00' },
          { day: 'Tuesday', hours: '08:30-23:00' },
          { day: 'Wednesday', hours: '08:30-23:00' },
          { day: 'Thursday', hours: '08:30-23:00' },
          { day: 'Friday', hours: '08:30-23:00' },
          { day: 'Saturday', hours: '09:00-22:00' },
          { day: 'Sunday', hours: '09:00-22:00' },
        ],
        services: ['Prescription', 'Cosmetics', 'Health Advice'],
        imageMobile:
          'https://images.unsplash.com/photo-1583912267550-ad360f7f1861?ixlib=rb-4.0.3',
        isOnDuty: false,
        latitude: '32.2478',
        longitude: '-8.5289',
        rating: 4.3,
      },
      {
        _id: '677e5164f788ac95bd780de3',
        name: 'Pharmacie Al Shifa',
        address: {
          street: "Avenue de l'Indépendance",
          city: 'Youssoufia',
          state: 'Youssoufia',
          country: 'Morocco',
          postalCode: '46300',
        },
        detailedAddress: "203 Avenue de l'Indépendance, Youssoufia 46300",
        phone: '+212523494567',
        email: 'alshifa@pharmacy.ma',
        openingHours: [
          { day: 'Monday', hours: '08:00-22:00' },
          { day: 'Tuesday', hours: '08:00-22:00' },
          { day: 'Wednesday', hours: '08:00-22:00' },
          { day: 'Thursday', hours: '08:00-22:00' },
          { day: 'Friday', hours: '08:00-22:00' },
          { day: 'Saturday', hours: '09:00-21:00' },
          { day: 'Sunday', hours: '09:00-21:00' },
        ],
        services: ['Prescription', 'Medical Tests', 'Vitamins'],
        imageMobile:
          'https://images.unsplash.com/photo-1576602976047-174e57a47881?ixlib=rb-4.0.3',
        isOnDuty: true,
        latitude: '32.2492',
        longitude: '-8.5312',
        rating: 4.8,
      },
    ]);

    return pharmacies;
  }

  private async seedReviews(users: User[], pharmacies: Pharmacy[]) {
    await this.reviewModel.create([
      {
        pharmacyId: pharmacies[0]._id,
        userId: users[1]._id,
        rating: 4,
        comment: 'Great service and friendly staff!',
      },
      {
        pharmacyId: pharmacies[1]._id,
        userId: users[1]._id,
        rating: 5,
        comment: 'Very convenient location and extended hours.',
      },
    ]);
  }

  private async seedNotifications(users: User[], pharmacies: Pharmacy[]) {
    await this.notificationModel.create([
      {
        userId: users[1]._id,
        pharmacyId: pharmacies[0]._id,
        message: 'Your prescription is ready for pickup',
        isRead: false,
      },
      {
        userId: users[1]._id,
        message:
          'Welcome to PharmaDirect! Complete your profile to get personalized recommendations.',
        isRead: true,
      },
    ]);
  }
}
