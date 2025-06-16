## Questão 1

**Elicitação Estratégica e Desafios:**

**Ao iniciar um projeto de Clube de Benefícios, como você abordaria a elicitação de
requisitos de stakeholders com perspectivas e prioridades potencialmente
conflitantes (ex: marketing quer flexibilidade para promoções, financeiro exige
rigidez na cobrança)? Descreva duas técnicas específicas que você utilizaria e
como você as adaptaria para resolver ou mitigar esses conflitos durante a fase de
levantamento.**

Eu primeiro procuraria entender direito o que cada área quer, conversando com cada time separado. Depois, montaria uma proposta que tente juntar o melhor dos dois lados, mostrando os prós e contras de cada um. Assim, todo mundo pode falar o que acha e a gente chega numa ideia que agrade tanto o pessoal do marketing quanto o financeiro.


**Requisitos:**

**Escolha um requisito funcional crucial (ex: gestão de assinaturas ou resgate de benefícios) para o Clube de Benefícios e discuta como a implementação de dois
requisitos não funcionais específicos (ex: segurança e performance) pode
impactar ou criar a melhor combinação no design e na implementação dessa funcionalidade. Como você balancearia essas considerações na prática?**

Vou falar sobre a gestão de assinaturas, que precisa ser bem sólida para garantir que as pessoas possam cadastrar, renovar e cancelar suas assinaturas sem problemas.

Para isso, é fundamental ter uma boa segurança, para evitar o vazamento de dados, e uma boa performance, porque todo mundo sabe que quanto mais gente acessando o sistema, mais ele pode ficar lento se não for bem planejado.

Para garantir que tudo funcione direito, eu faria testes de velocidade e desempenho, além de usar bibliotecas de empresas confiáveis sempre que necessário, vale a pena ressaltar que muita segurança nem sempre é bom, pois a performance aba sendo prejudicada, e o vice-versa tambem é verdadeiro.


**Complexidade e Validação de Critérios de Aceitação:**

**Para a funcionalidade de "Cancelamento de Assinatura" em um Clube de
Benefícios, além do cenário de sucesso, identifique e descreva dois cenários de
borda ou de falha (ex: cancelamento em período de carência, falha na
comunicação com gateway de pagamento). Como você garantiria que os critérios
de aceitação para esses cenários fossem robustos e cobrissem todas as
ramificações, e qual seria sua estratégia para validar esses critérios com os
stakeholders?**

Os cenários que identifico como borda ou falha no cancelamento de assinatura são:

Quando a pessoa tenta cancelar durante o período de carência, em que o cancelamento ainda não é permitido.

Quando ocorre uma falha na comunicação com o sistema de pagamento, o que pode impedir que o cancelamento seja finalizado corretamente.

Para garantir que esses casos sejam bem tratados, eu criaria critérios de aceitação bem definidos. Por exemplo:

No caso do período de carência, o sistema deve mostrar uma mensagem clara explicando o motivo pelo qual o cancelamento não pode ser feito naquele momento.

No caso de falha no pagamento, eu implementaria uma lógica de tentativa automática (retry). O sistema salvaria o motivo da falha e tentaria novamente após um tempo. Durante esse processo, o usuário receberia mensagens explicativas e, quando o cancelamento for concluído com sucesso ou definitivamente falhar, ele seria notificado de forma clara por um canal confiável (como e-mail ou notificação no app).

Assim, o usuário sempre saberia o que está acontecendo, e os erros seriam tratados de forma inteligente, sem prejudicar a experiência dele.


## Questão 2
**Design de Modelo de Dados para Flexibilidade:**

**Ao modelar o banco de dados para o Clube de Benefícios, como você projetaria as
entidades principais (Assinante, Assinatura, Plano, Benefício, Parceiro) para
permitir flexibilidade e fácil evolução no futuro (ex: novos tipos de benefícios,
planos com regras complexas, promoções sazonais)? Discuta as possibilidades
de sua abordagem (ex: normalização vs. desnormalização) e exemplifique com
duas entidades específicas.**

Minha ideia seria usar um modelo mais normalizado, ou seja, separar bem as informações em tabelas diferentes para evitar repetições e facilitar atualizações, por exemplo:

A entidade 't_plan(Planos)' teria uma relação com uma tabela de 't_rules(Regras)', que permitiria adicionar ou mudar regras facilmente, sem mexer diretamente nos dados dos planos existentes.

A entidade 't_benefit(benefícios)' teria uma relação com a entidade 't_partner(Parceiros)', o que permite que um benefício seja oferecido por mais de um parceiro ou que um parceiro ofereça vários tipos de benefício.

**Otimização e Resiliência em Fluxos de Processo:**

**Descreva o fluxo de processo para o "Ultilização de um Benefício" por um
assinante. Identifique dois potenciais pontos de falha ou gargalos nesse processo
e proponha soluções para otimizá-lo ou torná-lo mais resiliente, considerando a
experiência do usuário e a integridade dos dados.**

O fluxo de uso de um benefício por um assinante pode funcionar assim:

O assinante acessa o sistema (site ou app).
Escolhe um benefício disponível para ele.
Confirma o uso ou recebe um código/cupom para apresentar ao parceiro.
O sistema registra que o benefício foi utilizado.

Dois pontos que podem dar problema nesse processo são:

Lentidão ou falha na comunicação com o parceiro, na hora de gerar ou validar o benefício.

Solução: Utilizar um sistema de filas ou mensagens assíncronas (como AWS SQS, por exemplo) para garantir que, mesmo que o parceiro esteja temporariamente offline, o benefício seja processado assim que possível. Também é importante exibir uma mensagem clara para o usuário, informando que o benefício será confirmado em breve.

Erro ao registrar o uso do benefício no banco de dados, o que pode fazer o cliente usar duas vezes ou não receber o benefício.

Solução: Usar transações de banco de dados para garantir que tudo seja salvo corretamente. Se der erro, mostrar uma mensagem para o usuário e tentar novamente automaticamente, sem ele precisar refazer tudo.

**Estratégias de Integração e Gestão de Riscos:**

**Para duas das integrações externas mais críticas de um sistema de Clube de
Benefícios (ex: gateway de pagamento, APIs de parceiros), discuta as estratégias
de integração que você escolheria (ex: síncrona vs. assíncrona, polling vs.
webhooks), e como você gerenciaria os riscos relacionados.**

1. Gateway de pagamento
Estratégia de integração: Eu usaria uma integração síncrona, porque o usuário precisa saber na hora se o pagamento deu certo ou não.

Gestão de riscos: Para evitar problemas como instabilidade do serviço, eu implementaria:

Requisições com timeout e retries (tentativas automáticas em caso de falha).

Registro de erros para facilitar o monitoramento e análise posterior.

Caso o pagamento não possa ser confirmado na hora, o sistema deixaria o status como “pendente”, e o usuário seria notificado assim que o pagamento fosse processado com sucesso.

2. APIs de parceiros
Estratégia de integração: Aqui, a melhor abordagem seria uma comunicação assíncrona usando webhooks, ou seja, o parceiro avisa o sistema quando algo acontecer (por exemplo, quando o benefício for resgatado).

Gestão de riscos: Para garantir que o sistema não perca informações importantes, eu usaria:

Amazon SQS (Simple Queue Service) para armazenar todos os eventos recebidos dos parceiros. Isso garante que, mesmo que algo falhe no momento do recebimento, a mensagem fique na fila e possa ser processada mais tarde com segurança.

Logs completos de todas as requisições e respostas.

Verificação de assinaturas nos webhooks para garantir que o evento realmente veio do parceiro.

Uma lógica de reprocessamento automático para chamadas que falharam ou não chegaram corretamente.

## Questão 3

** Design Arquitetural e Tomada de Decisão:**

**Proponha uma arquitetura de alto nível para o sistema do Clube de Benefícios,
justificando suas escolhas e explorando as vantagens envolvidas. Como essa
arquitetura balancearia a necessidade de escalabilidade futura com a velocidade
de desenvolvimento inicial?**

**Front-end (app e site):**

Uma aplicação web e mobile leve, feita com frameworks modernos como React ou Flutter, que oferece uma interface rápida e amigável para o usuário.

**API Gateway:**

Um ponto central que recebe todas as requisições do front-end e direciona para os serviços apropriados. Isso facilita a segurança, autenticação e controle de acesso.

**Backend baseado em microserviços:**

Dividir o sistema em serviços menores e independentes, como:

Serviço de gestão de assinaturas

Serviço de pagamentos

Serviço de benefícios

Serviço de parceiros

Isso permite que cada parte evolua separadamente e seja escalada conforme a demanda.

**Banco de dados:**

Usar bancos diferentes conforme a necessidade, por exemplo:

Banco relacional (ex: Amazon RDS) para dados estruturados e transacionais, como assinaturas e pagamentos.

Banco NoSQL (ex: DynamoDB) para dados de alto volume e leitura rápida, como histórico de uso de benefícios.

5. Filas e Mensageria (ex: Amazon SQS):
Para garantir comunicação assíncrona entre serviços e com parceiros externos, melhorando a resiliência e performance do sistema.

6. Monitoramento e Logging:
Ferramentas como AWS CloudWatch e Elastic Stack para acompanhar a saúde do sistema e identificar problemas rapidamente.

**Justificativa e vantagens**

Escalabilidade: Os microserviços permitem que partes do sistema que precisam suportar mais usuários sejam escaladas separadamente, sem precisar aumentar tudo de uma vez.

**Velocidade de desenvolvimento:**

Começar com serviços básicos e ir adicionando funcionalidades e serviços conforme a necessidade. Além disso, usar frameworks modernos agiliza o desenvolvimento do front-end.

**Flexibilidade:**
Serviços independentes facilitam a manutenção e a implementação de novas funcionalidades ou integrações no futuro.

**Resiliência:**

O uso de filas e mensageria ajuda a evitar falhas críticas e garante que as mensagens importantes não sejam perdidas.

**Estratégia de Lançamento de MVP e Métrica de Sucesso:**

**Supondo um cenário onde o Clube de Benefícios precisa ser lançado em 3 meses
com um orçamento limitado, qual seria a sua estratégia para definir o Produto
Mínimo Viável (MVP)? Identifique três funcionalidades que você priorizaria para o
MVP e explique como você mediria o sucesso dessa primeira versão após o
lançamento.**

1- Cadastro e gestão de assinaturas:
Permitir que os usuários se cadastrem, escolham um plano e façam a renovação ou cancelamento da assinatura de forma simples.

2- Consulta e resgate de benefícios:
Mostrar os benefícios disponíveis para o assinante e permitir que ele resgate, recebendo um código ou confirmação simples para usar no parceiro.

3- Processamento básico de pagamento:
Integração com um gateway de pagamentos mais conhecidos e usados para cobrar a assinatura, com confirmação imediata para garantir que o usuário saiba se o pagamento foi aprovado.

Como medir o sucesso do MVP:
Número de assinaturas ativas: Quantos usuários completaram o cadastro e fizeram pelo menos um pagamento.

Taxa de uso dos benefícios: Quantos benefícios foram resgatados em relação ao total disponível, mostrando engajamento.

Feedback dos usuários: Coletar feedbacks por meio de canais de supporte rápidos ou atendimento para entender o que gostaram e o que falta melhorar.


# Questão 4 (ESTA REPETIDA)

# Questão 5 

**
Considerando a natureza do Clube de Benefícios (operações de I/O intensivas,
pagamentos, notificações), discuta a adequação do Node.js como tecnologia para
o backend. Quais seriam as vantagens e desvantagens de utilizá-lo, e como você
mitigaria os desafios conhecidos (ex: CPU-bound tasks, gerenciamento de
concorrência) em um ambiente de produção?
Frontend Multiplataforma com Angular/Ionic:
A equipe decidiu utilizar Angular com Ionic para o desenvolvimento da interface do
usuário (web e mobile). Avalie esta escolha. Quais seriam os principais benefícios
(ex: desenvolvimento cross-platform, reutilização de código) e potenciais desafios
(ex: performance em UIs complexas, acesso a funcionalidades nativas
específicas) dessa abordagem para o Clube de Benefícios?
**


Adequação do Node.js para o backend do Clube de Benefícios

Vantagens:
Excelente para operações I/O intensivas: Node.js é muito eficiente para lidar com múltiplas conexões e tarefas que envolvem acesso a bancos de dados, APIs, pagamentos e notificações, graças ao seu modelo assíncrono e não bloqueante.
Rapidez no desenvolvimento: Usar JavaScript no backend e frontend facilita a integração e acelera o desenvolvimento, uma unica linguagem para tudo!
Grande ecossistema: Quase tudo é em nodejs!, muitas bibliotecas prontas para pagamentos, autenticação e comunicação com APIs.

Desvantagens:
Tarefas pesadas de CPU: Node.js roda em uma única thread principal, o que pode causar lentidão se houver processamento pesado (ex: cálculos complexos, criptografia intensiva na parte de segurança).
Complexidade do código assíncrono: Sem boas práticas, pode gerar código difícil de manter.

Mitigação dos desafios:
Usar worker threads ou processos separados para tarefas pesadas de CPU
Implementar clustering para aproveitar múltiplos núcleos do servidor
Offload de tarefas pesadas para serviços externos ou filas (ex: AWS SQS).
Aplicar boas práticas com async/await e monitoramento constante da aplicação.


Avaliação do uso de Angular com Ionic para frontend multiplataforma
Principais benefícios:

Desenvolvimento cross-platform: Com uma única base de código, é possível criar apps para web, iOS e Android, economizando tempo e recursos.
Reutilização de código: Componentes, lógica e estilos são compartilhados entre plataformas, facilitando manutenção.
Comunidade boa  e suporte: Angular e Ionic têm muitas ferramentas, plugins e documentação.

Potenciais desafios:

Performance em UIs complexas: Já tive bastante problemas com animações complexas, muita perca de desempenho no mobile.
Acesso a funcionalidades nativas: As bibliotecas existentes do ionic implementam uma brigde para se comunicarem, existe muita perca de
desempenho ao comunicar com funcionalidades nativas, e há a grande chance de ter que desenvolver algo novo nativo.

Tamanho do app: Aplicações Ionic tendem a ser maiores que os app nativos;

Minha opinião rápida é que eu usaria Flutter, porque ele gera código nativo, permitindo criar apps com visuais incríveis sem muito esforço. Embora ele também seja mono-thread, como o Node.js, já existem várias formas de separar processamentos pesados da interface  (com a implementação de isolate) para manter a performance. Além disso, Flutter está super popular, conta com uma comunidade enorme e tem uma curva de aprendizado bem rápida. As integrações com funcionalidades nativas são simples e bastante fluidas também.