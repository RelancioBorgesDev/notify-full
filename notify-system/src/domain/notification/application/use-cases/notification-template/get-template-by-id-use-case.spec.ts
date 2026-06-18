import { InMemoryNotificationTemplateRepository } from '../../../../../../test/repositories/in-memory-notification-template-repository';
import { Channel } from '@/domain/notification/enterprise/entities/notification';
import { GetNotificationTemplateByIdUseCase } from './get-template-by-id-use-case';
import { NotificationTemplate } from '@/domain/notification/enterprise/entities/notification-template';

let notificationTemplateRepository: InMemoryNotificationTemplateRepository;
let getTemplateByIdUseCase: GetNotificationTemplateByIdUseCase;

describe('Get Template By Id Use Case', () => {
  beforeEach(() => {
    notificationTemplateRepository =
      new InMemoryNotificationTemplateRepository();
    getTemplateByIdUseCase = new GetNotificationTemplateByIdUseCase(
      notificationTemplateRepository,
    );
  });

  it('should be able to get the template by the id', async () => {
    const template = NotificationTemplate.create({
      title: 'Promoção de Jogo',
      content: 'Aproveite 20% de desconto em todos os produtos!',
      channel: Channel.EMAIL,
      subject: 'Oferta exclusiva!',
    });

    await notificationTemplateRepository.create(template);

    const { template: foundTemplate } = await getTemplateByIdUseCase.execute({
      templateId: template.id,
    });

    expect(foundTemplate).toBeTruthy();
    expect(foundTemplate.id.equals(template.id)).toBe(true);
    expect(foundTemplate.title).toBe(template.title);
    expect(foundTemplate.subject).toBe(template.subject);
    expect(foundTemplate.channel).toBe(template.channel);
  });
});
