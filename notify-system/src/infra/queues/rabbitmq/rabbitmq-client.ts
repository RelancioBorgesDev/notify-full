import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import {
  Channel,
  ChannelModel,
  ConsumeMessage,
  Options,
  Replies,
} from 'amqplib';

@Injectable()
export class RabbitMQClient {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private isConnected = false;

  constructor() {}

  public async connect(url: string | undefined): Promise<void> {
    if (!url) {
      throw new Error('RabbitMQ URL is not provided.');
    }

    if (this.isConnected) {
      console.log('✅ RabbitMQ já conectado');
      return;
    }

    try {
      const channelModel = await amqp.connect(url);
      this.connection = channelModel;
      this.channel = await this.connection.createChannel();
      this.isConnected = true;
    } catch (error) {
      this.isConnected = false;
      this.connection = null;
      this.channel = null;
      console.error('❌ Falha ao conectar ao RabbitMQ:', error);
      throw error;
    }
  }

  public getChannel(): Channel {
    if (!this.channel) {
      throw new Error(
        'O canal do RabbitMQ não está inicializado. Chame connect() primeiro.',
      );
    }
    return this.channel;
  }

  public async assertQueue(
    queue: string,
    options?: Options.AssertQueue,
  ): Promise<Replies.AssertQueue> {
    return this.getChannel().assertQueue(queue, options);
  }

  public async sendToQueue(
    queue: string,
    data: any,
    options?: Options.Publish,
  ): Promise<void> {
    const buffer = Buffer.from(JSON.stringify(data));
    this.getChannel().sendToQueue(queue, buffer, options);
  }

  public consume(
    queue: string,
    onMessage: (msg: ConsumeMessage | null) => void,
    options?: Options.Consume,
  ): Promise<Replies.Consume> {
    return this.getChannel().consume(queue, onMessage, options);
  }

  public async close(): Promise<void> {
    if (this.isConnected) {
      try {
        if (this.channel) {
          await this.channel.close();
          this.channel = null;
        }
        if (this.connection) {
          await this.connection.close();
          this.connection = null;
        }
        this.isConnected = false;
        console.log('🚪 Conexão RabbitMQ fechada');
      } catch (error) {
        console.error('❌ Erro ao fechar a conexão RabbitMQ:', error);
      }
    }
  }
}
