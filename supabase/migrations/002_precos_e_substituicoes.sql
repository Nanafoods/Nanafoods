-- NANA'S FOOD — V17 — preços e atualização de nomes
-- Execute este arquivo no SQL Editor se o schema V16 já foi instalado.

-- Remove itens antigos substituídos/fora da tabela de preços atual.
delete from public.products where id in ('molho-verde','bacon','bacon-cheddar','frango-catupiry','catupiry');
delete from public.addons where id in ('catupiry','bacon','carne-moida','molho-verde','barbecue');

insert into public.products(id,name,description,price,image_path,is_active,is_sold_out,is_future,sort_order) values
('goob','Goob','',2.50,'assets/doguinho.jpg',true,false,false,5),
('tradicional','Hot dog simples','01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha e barbecue.',5.00,'assets/doguinho.jpg',true,false,false,10),
('tradicional-duplo','Hot dog duplo','02 salsichas, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha e barbecue.',6.00,'assets/doguinho.jpg',true,false,false,20),
('bolonhesa','Hot dog bolonhesa','01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha, carne moída e barbecue.',6.50,'assets/doguinho.jpg',true,false,false,30),
('frango','Hot dog frango','01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha e frango desfiado.',6.50,'assets/doguinho.jpg',true,false,false,40),
('cheddar','Hot dog cheddar','01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha, molho cheddar e barbecue.',6.50,'assets/doguinho.jpg',true,false,false,50),
('requeijao','Hot dog requeijão','01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha e molho requeijão.',6.50,'assets/doguinho.jpg',true,false,false,60),
('milho','Hot dog milho','',6.50,'assets/doguinho.jpg',true,false,false,70),
('calabresa','Hot dog calabresa','01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha, calabresa e barbecue.',6.50,'assets/doguinho.jpg',true,false,false,80),
('frango-requeijao','Hot dog frango c/ requeijão','01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha, frango desfiado e requeijão.',8.00,'assets/doguinho.jpg',true,false,false,90),
('calabresa-cheddar','Hot dog calabresa c/ cheddar','01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha, calabresa, cheddar e barbecue.',8.00,'assets/doguinho.jpg',true,false,false,100),
('supremo','Supremo','01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha, carne moída, calabresa, frango, requeijão, cheddar e barbecue.',13.50,'assets/doguinho.jpg',true,false,false,110)
on conflict(id) do update set
name=excluded.name, description=excluded.description, price=excluded.price, image_path=excluded.image_path,
is_active=excluded.is_active, is_sold_out=excluded.is_sold_out, is_future=excluded.is_future,
sort_order=excluded.sort_order, updated_at=now();

insert into public.addons(id,name,price,is_active,sort_order) values
('cheddar','Cheddar',1.50,true,10),
('requeijao','Requeijão',1.50,true,20),
('calabresa','Calabresa',1.50,true,30),
('frango','Frango',1.50,true,40),
('bolonhesa','Bolonhesa',1.50,true,50),
('milho','Milho',1.00,true,60),
('salsicha','Salsicha',1.00,true,70)
on conflict(id) do update set
name=excluded.name, price=excluded.price, is_active=excluded.is_active,
sort_order=excluded.sort_order, updated_at=now();
