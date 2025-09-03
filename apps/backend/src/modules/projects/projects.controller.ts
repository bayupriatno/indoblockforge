import { Controller, Post, Body, UseGuards, Get, Request, Param, Delete, Put, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';

@UseGuards(AuthGuard('jwt'))
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private prisma: PrismaService,
  ) {}

  @Post()
  async create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(req.user.id, createProjectDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.projectsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.projectsService.findOne(id, req.user.id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Request() req, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, req.user.id, updateProjectDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(id, req.user.id);
  }

  @Get(':id/contracts')
  async getContracts(@Param('id') id: string, @Request() req) {
    return this.projectsService.getContractsByProjectId(id, req.user.id);
  }
}
