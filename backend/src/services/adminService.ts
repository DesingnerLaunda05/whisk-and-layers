import { adminRepository } from '../repositories/adminRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { bakeryRepository } from '../repositories/bakeryRepository.js';
import { orderRepository } from '../repositories/orderRepository.js';

export class AdminService {
  public getDashboardMetrics() {
    return adminRepository.getPlatformMetrics();
  }

  public getUsers(params: any) {
    return userRepository.findAll(params);
  }

  public getBakeries(params: any) {
    return bakeryRepository.findAll({ ...params, approvedOnly: false });
  }

  public getOrders(params: any) {
    return orderRepository.findAllForAdmin(params);
  }

  public toggleBakeryApproval(bakeryId: number, isApproved: boolean) {
    const updated = bakeryRepository.update(bakeryId, { isApproved });
    if (!updated) {
      throw new Error('Bakery not found.');
    }
    return updated;
  }

  public toggleUserStatus(userId: number, isActive: boolean) {
    const updated = userRepository.update(userId, { isActive });
    if (!updated) {
      throw new Error('User not found.');
    }
    return updated;
  }
}

export const adminService = new AdminService();
