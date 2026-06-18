import { InMemoryNotificationTemplateRepository } from '../../../../../../test/repositories/in-memory-notification-template-repository';
import { Channel } from '@/domain/notification/enterprise/entities/notification';
import { NotificationTemplate } from '@/domain/notification/enterprise/entities/notification-template';
import { ListNotificationTemplatesUseCase } from './list-templates-use-case';
import { UpdateNotificationTemplateUseCase } from './update-template-use-case';

let notificationTemplateRepository: InMemoryNotificationTemplateRepository;
let updateNotificationTemplateUseCase: UpdateNotificationTemplateUseCase;

describe('Update Template Use Case', () => {
  beforeEach(() => {
    notificationTemplateRepository =
      new InMemoryNotificationTemplateRepository();
    updateNotificationTemplateUseCase = new UpdateNotificationTemplateUseCase(
      notificationTemplateRepository,
    );
  });

  it('should be able to update a template', async () => {
    const templateData = NotificationTemplate.create({
      title: 'Promoção de Jogo',
      content: 'Aproveite 20% de desconto em todos os produtos!',
      channel: Channel.EMAIL,
      subject: 'Oferta exclusiva!',
    });

    await notificationTemplateRepository.create(templateData);
    const { template } = await updateNotificationTemplateUseCase.execute({
      templateId: templateData.id,
      content: 'Novo conteúdo',
      channel: Channel.SMS,
      subject: 'Nova oferta!',
    });

    const updated = await notificationTemplateRepository.findById(template.id);

    expect(updated).toBeDefined();
    expect(updated!.id.equals(templateData.id)).toBe(true);
    expect(updated!.content).toBe('Novo conteúdo');
    expect(updated!.channel).toBe(Channel.SMS);
    expect(updated!.subject).toBe('Nova oferta!');
  });
});
