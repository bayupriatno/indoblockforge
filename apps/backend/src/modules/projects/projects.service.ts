import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project || project.userId !== userId) {
      throw new NotFoundException('Proyek tidak ditemukan atau Anda tidak memiliki akses');
    }
    return project;
  }

  async update(id: string, userId: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(id, userId);
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: string, userId: string) {
    const project = await this.findOne(id, userId);
    return this.prisma.project.delete({
      where: { id },
    });
  }

  async getContractsByProjectId(projectId: string, userId: string) {
    const project = await this.findOne(projectId, userId);
    if (!project) {
        throw new NotFoundException('Proyek tidak ditemukan.');
    }
    return this.prisma.contract.findMany({
      where: { projectId },
    });
  }
}
