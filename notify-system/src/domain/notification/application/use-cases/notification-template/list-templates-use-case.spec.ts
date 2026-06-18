import { InMemoryNotificationTemplateRepository } from '../../../../../../test/repositories/in-memory-notification-template-repository';
import { Channel } from '@/domain/notification/enterprise/entities/notification';
import { NotificationTemplate } from '@/domain/notification/enterprise/entities/notification-template';
import { ListNotificationTemplatesUseCase } from './list-templates-use-case';

let notificationTemplateRepository: InMemoryNotificationTemplateRepository;
let listNotificationsTemplatesUseCase: ListNotificationTemplatesUseCase;

describe('List Notifications Templates Use Case', () => {
  beforeEach(() => {
    notificationTemplateRepository =
      new InMemoryNotificationTemplateRepository();
    listNotificationsTemplatesUseCase = new ListNotificationTemplatesUseCase(
      notificationTemplateRepository,
    );
  });

  it('should be able to list all the templates', async () => {
    const template1 = NotificationTemplate.create({
      title: 'Promoção de Jogo',
      content: 'Aproveite 20% de desconto em todos os produtos!',
      channel: Channel.EMAIL,
      subject: 'Oferta exclusiva!',
    });

    const template2 = NotificationTemplate.create({
      title: 'Promoção de Vendas',
      content: 'Aproveite 30% de desconto em todos os produtos!',
      channel: Channel.EMAIL,
      subject: 'Oferta exclusiva!',
    });

    await notificationTemplateRepository.create(template1);
    await notificationTemplateRepository.create(template2);
    const { templates } = await listNotificationsTemplatesUseCase.execute();

    expect(templates).toHaveLength(2);
    expect(templates.some((t) => t.id.equals(template1.id))).toBe(true);
    expect(templates.some((t) => t.id.equals(template2.id))).toBe(true);
  });
});
