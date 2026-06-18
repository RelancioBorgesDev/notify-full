import { InMemoryNotificationTemplateRepository } from 'test/repositories/in-memory-notification-template-repository';
import { DeleteNotificationTemplateUseCase } from './delete-template-use-case';
import { User } from '@/domain/users/enterprise/entities/user';
import { Channel } from '@/domain/notification/enterprise/entities/notification';
import { NotificationTemplate } from '@/domain/notification/enterprise/entities/notification-template';

let templatesRepository: InMemoryNotificationTemplateRepository;
let sut: DeleteNotificationTemplateUseCase;

describe('Delete Notification Use Case', () => {
  beforeAll(() => {
    templatesRepository = new InMemoryNotificationTemplateRepository();
    sut = new DeleteNotificationTemplateUseCase(templatesRepository);
  });

  it('should be able to delete a template', async () => {
    const user = User.create({
      email: 'user1@example.com',
      name: 'User 1',
      passwordHash: 'pass123',
    });

    const template = NotificationTemplate.create({
      title: 'Promoção de Jogo',
      content: 'Aproveite 20% de desconto em todos os produtos!',
      channel: Channel.EMAIL,
      subject: 'Oferta exclusiva!',
    });

    await templatesRepository.create(template);

    await sut.execute({ templateId: template.id });

    const found = await templatesRepository.findById(template.id);
    expect(found).toBeNull();
  });
});
