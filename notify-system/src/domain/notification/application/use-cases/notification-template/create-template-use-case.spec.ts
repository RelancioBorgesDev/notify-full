import { InMemoryNotificationTemplateRepository } from '../../../../../../test/repositories/in-memory-notification-template-repository';
import { CreateNotificationTemplateUseCase } from './create-template-use-case';
import { Channel } from '@/domain/notification/enterprise/entities/notification';

let notificationTemplateRepository: InMemoryNotificationTemplateRepository;
let createNotificationTemplateUseCase: CreateNotificationTemplateUseCase;

describe('Create Template Use Case', () => {
  beforeEach(() => {
    notificationTemplateRepository =
      new InMemoryNotificationTemplateRepository();

    createNotificationTemplateUseCase = new CreateNotificationTemplateUseCase(
      notificationTemplateRepository,
    );
  });

  it('should be able to create a template', async () => {
    // Arrange
    const templateData = {
      title: 'Promoção de Jogo',
      content: 'Aproveite 20% de desconto em todos os produtos!',
      channel: Channel.EMAIL,
      subject: 'Oferta exclusiva!',
    };

    // Act
    const { template } =
      await createNotificationTemplateUseCase.execute(templateData);

    const foundTemplate = await notificationTemplateRepository.findById(
      template.id,
    );

    // Assert
    expect(template).toBeTruthy();
    expect(foundTemplate).not.toBeNull();
    expect(foundTemplate!.title).toBe(templateData.title);
    expect(foundTemplate!.content).toBe(templateData.content);
    expect(foundTemplate!.channel).toBe(templateData.channel);
    expect(foundTemplate!.subject).toBe(templateData.subject);
  });
});
