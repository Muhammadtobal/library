import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DownloadsService } from './downloads.service';
import { CreateDownloadDto } from './dto/create-download.dto';
import { UpdateDownloadDto } from './dto/update-download.dto';

@Controller('downloads')
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}

  @Post()
  create(@Body() createDownloadDto: CreateDownloadDto) {
    return this.downloadsService.create(createDownloadDto);
  }

  @Get()
  findAll() {
    return this.downloadsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.downloadsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDownloadDto: UpdateDownloadDto) {
    return this.downloadsService.update(+id, updateDownloadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.downloadsService.remove(+id);
  }
}
