# Nana's Food — V16 com Supabase + painel administrativo

Esta versão mantém o site de pedidos e adiciona `/admin` para controlar a operação sem editar código.

## O que o painel permite

- login do administrador com Supabase Auth;
- abrir a loja manualmente;
- fechar a loja manualmente;
- usar modo automático pelo horário;
- editar preço e descrição dos produtos;
- tirar um item do cardápio e colocá-lo de volta;
- marcar produto como **Esgotado** sem apagá-lo;
- ativar/desativar adicionais e condimentos;
- alterar preço dos adicionais;
- configurar horários por dia;
- configurar raio de entrega, taxa padrão, CEP/endereço/coordenadas da loja.

Quando a loja estiver fechada, o cardápio continua visível, mas a montagem/finalização de pedidos fica bloqueada.

## 1. Não abra pelo `file:///`

Para Supabase/Auth, use um servidor local.

### VS Code + Live Server

Abra esta pasta no VS Code, clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Normalmente:

- Cliente: `http://127.0.0.1:5500/`
- Admin: `http://127.0.0.1:5500/admin/`

Também incluí `INICIAR_SITE.bat`, que tenta iniciar um servidor Python na porta 5500.

## 2. Criar o banco

No Supabase:

1. crie um projeto;
2. abra **SQL Editor**;
3. cole e execute `supabase/schema.sql` inteiro.

O script cria e popula:

- `products`
- `addons`
- `condiments`
- `store_settings`
- `store_hours`
- `delivery_fee_tiers`
- `admins`

Também configura RLS para leitura pública e escrita apenas pelo administrador.

## 3. Conectar o site

Abra `supabase-config.js` e preencha:

```js
window.SUPABASE_CONFIG = {
  url: "https://SEU-PROJETO.supabase.co",
  publishableKey: "SUA_PUBLISHABLE_KEY"
};
```

Use apenas a **Publishable key** (ou anon key de projeto antigo).
Nunca use `service_role`/secret key no site.

## 4. Criar o administrador

No Supabase, vá em **Authentication > Users** e crie seu usuário com e-mail e senha.

Depois rode no SQL Editor:

```sql
insert into public.admins(user_id,email)
select id,email from auth.users where email = 'SEU_EMAIL@EXEMPLO.COM'
on conflict(user_id) do update set email = excluded.email;
```

Troque o e-mail pelo e-mail real que você criou.

Agora abra:

`http://127.0.0.1:5500/admin/`

## 5. Status da loja

O painel tem três modos:

- **Automático:** segue `store_hours`.
- **Forçar aberta:** aceita pedidos independentemente do horário.
- **Forçar fechada:** bloqueia pedidos imediatamente.

A base inicia em **Forçar aberta**, para você configurar os horários primeiro sem bloquear o site por acidente.

## 6. Horário automático

Nenhum dia foi marcado como aberto no banco porque você ainda não informou o horário real de funcionamento.
Configure isso no painel antes de ativar o modo Automático.

O sistema suporta fechamento depois da meia-noite (por exemplo, 18:00 → 01:00).

## 7. Atualização do site

O site busca os dados do Supabase ao abrir e novamente a cada 30 segundos. Ele também tenta usar Realtime quando disponível.

Assim, quando você marcar um produto como esgotado ou fechar a loja no painel, a mudança aparece no site do cliente sem republicar os arquivos.

## Fallback

Se `supabase-config.js` estiver vazio, o site do cliente continua funcionando com os dados locais do `config.js`, mas o painel administrativo não fica disponível.


## V17 — tabela de preços e substituições

Foi aplicada a nova tabela de preços informada. Também foram feitas as substituições solicitadas em todo o cardápio visível:

- `bacon` → `calabresa`
- `catupiry` → `requeijão`

### Cardápio atual

- Goob — R$ 2,50
- Hot dog simples — R$ 5,00
- Hot dog duplo — R$ 6,00
- Hot dog bolonhesa — R$ 6,50
- Hot dog frango — R$ 6,50
- Hot dog cheddar — R$ 6,50
- Hot dog requeijão — R$ 6,50
- Hot dog milho — R$ 6,50
- Hot dog calabresa — R$ 6,50
- Hot dog frango c/ requeijão — R$ 8,00
- Hot dog calabresa c/ cheddar — R$ 8,00
- Supremo — R$ 13,50

### Adicionais

- Cheddar — R$ 1,50
- Requeijão — R$ 1,50
- Calabresa — R$ 1,50
- Frango — R$ 1,50
- Bolonhesa — R$ 1,50
- Milho — R$ 1,00
- Salsicha — R$ 1,00

Se o Supabase V16 já estiver instalado, execute:

`supabase/migrations/002_precos_e_substituicoes.sql`

no SQL Editor para atualizar os dados existentes.

A tabela fornecida não trouxe descrição para `Goob` nem para `Hot dog milho`; esses dois itens foram mantidos sem descrição para não inventar informações.
