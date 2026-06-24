insert into categories (slug, name_ar, name_en, image_url, is_active)
values
  ('sneakers', 'سنيكرز', 'Sneakers', '/images/template.svg', true),
  ('sport-shoes', 'أحذية رياضية', 'Sport Shoes', '/images/template.svg', true),
  ('casual-shoes', 'أحذية كاجوال', 'Casual Shoes', '/images/template.svg', true),
  ('running', 'جري وأداء', 'Running', '/images/template.svg', true),
  ('luxury-sneakers', 'سنيكرز فاخر', 'Luxury Sneakers', '/images/template.svg', true),
  ('air-max', 'اير ماكس', 'Air Max', '/images/template.svg', true),
  ('jordan', 'جوردن', 'Jordan', '/images/template.svg', true),
  ('adidas', 'أديداس', 'Adidas', '/images/template.svg', true),
  ('new-balance', 'نيو بالنس', 'New Balance', '/images/template.svg', true)
on conflict (slug) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  image_url = excluded.image_url,
  is_active = excluded.is_active;

with seed (
  sku, slug, model_ar, model_en, brand, category_slug, sell_price, old_price, stock,
  colors, badge, featured, on_offer, best_seller, images
) as (
  values
    ('SMSM-MIR-ADZ-001','adidas-adizero-mirror','أديداس أدزيرو','Adizero','Adidas','adidas',1550,null,9,array['Black','White'],'NEW',true,false,false,array['/images/SHOES/ADIDAS%20ADZIRO/FRONT.png','/images/SHOES/ADIDAS%20ADZIRO/LEFT.png','/images/SHOES/ADIDAS%20ADZIRO/RIGHT.png','/images/template.svg','/images/SHOES/ADIDAS%20ADZIRO/TOP.png','/images/template.svg']),
    ('SMSM-MIR-AFBR-002','nike-air-force-black-red-mirror','اير فورس أسود في أحمر','Air Force Black Red','Nike','sneakers',1400,1550,4,array['Black','Red'],'OFFER',false,true,false,array['/images/SHOES/AIR%20FORCE%20BLACK%20RED/FRONT.png','/images/SHOES/AIR%20FORCE%20BLACK%20RED/LEFT.png','/images/SHOES/AIR%20FORCE%20BLACK%20RED/RIGHT.png','/images/SHOES/AIR%20FORCE%20BLACK%20RED/REAR.png','/images/SHOES/AIR%20FORCE%20BLACK%20RED/TOP.png','/images/SHOES/AIR%20FORCE%20BLACK%20RED/SOLE.png']),
    ('SMSM-MIR-AFWL-003','nike-air-force-white-limited-mirror','اير فورس أبيض ليمتد','Air Force White Limited','Nike','sneakers',1250,null,8,array['White'],'LIMITED',true,false,false,array['/images/SHOES/AIR%20FORCE%20WHITE%20LIMITED/FRONT.png','/images/SHOES/AIR%20FORCE%20WHITE%20LIMITED/LEFT.png','/images/SHOES/AIR%20FORCE%20WHITE%20LIMITED/RIGHT.png','/images/template.svg','/images/SHOES/AIR%20FORCE%20WHITE%20LIMITED/TOP.png','/images/template.svg']),
    ('SMSM-MIR-AFWM-004','nike-air-force-white-mirror-molten','اير فورس أبيض ميرور مولتن','Air Force White Mirror Molten','Nike','sneakers',1100,null,13,array['White'],'BESTSELLER',true,false,true,array['/images/SHOES/AIR%20FORCE%20WHITE%20MIRROR%20MOLTEN%20METAL/FRONT.png','/images/SHOES/AIR%20FORCE%20WHITE%20MIRROR%20MOLTEN%20METAL/LEFT.png','/images/SHOES/AIR%20FORCE%20WHITE%20MIRROR%20MOLTEN%20METAL/RIGHT.png','/images/SHOES/AIR%20FORCE%20WHITE%20MIRROR%20MOLTEN%20METAL/REAR.png','/images/SHOES/AIR%20FORCE%20WHITE%20MIRROR%20MOLTEN%20METAL/TOP.png','/images/SHOES/AIR%20FORCE%20WHITE%20MIRROR%20MOLTEN%20METAL/SOLE.png']),
    ('SMSM-MIR-AM95C-005','nike-air-max-95-cortz-mirror','اير ماكس 95 كورتز','Air Max 95 Cortz','Nike','air-max',1850,null,7,array['Black','Gray'],'NEW',true,false,false,array['/images/SHOES/AIR%20MAX%2095%20CORTZ/FRONT.png','/images/SHOES/AIR%20MAX%2095%20CORTZ/LEFT.png','/images/SHOES/AIR%20MAX%2095%20CORTZ/RIGHT.png','/images/template.svg','/images/SHOES/AIR%20MAX%2095%20CORTZ/TOP.png','/images/template.svg']),
    ('SMSM-MIR-AM95W-006','nike-air-max-95-limited-white','اير ماكس 95 ليمتد وايت','Air Max 95 Limited White','Nike','air-max',1800,null,6,array['White','Gray'],'LIMITED',true,false,false,array['/images/SHOES/AIR%20MAX%2095%20LIMITED%20WHITE/FRONT.png','/images/SHOES/AIR%20MAX%2095%20LIMITED%20WHITE/LEFT.png','/images/SHOES/AIR%20MAX%2095%20LIMITED%20WHITE/RIGHT.png','/images/template.svg','/images/SHOES/AIR%20MAX%2095%20LIMITED%20WHITE/TOP.png','/images/template.svg']),
    ('SMSM-MIR-AM95S-007','nike-air-max-95-sayna-mirror','اير ماكس 95 ساينا','Air Max 95 Sayna','Nike','air-max',1800,null,6,array['Gray','Black'],'NEW',true,false,false,array['/images/SHOES/AIR%20MAX%2095%20SAYNA/FRONT.png','/images/SHOES/AIR%20MAX%2095%20SAYNA/LEFT.png','/images/SHOES/AIR%20MAX%2095%20SAYNA/RIGHT.png','/images/template.svg','/images/SHOES/AIR%20MAX%2095%20SAYNA/TOP.png','/images/template.svg']),
    ('SMSM-MIR-AM97-008','nike-air-max-97-mirror','اير ماكس 97','Air Max 97','Nike','air-max',1500,1700,27,array['Silver','White'],'OFFER',true,true,true,array['/images/SHOES/AIR%20MAX%2097/FRONT.png','/images/SHOES/AIR%20MAX%2097/LEFT.png','/images/SHOES/AIR%20MAX%2097/RIGHT.png','/images/SHOES/AIR%20MAX%2097/REAR.png','/images/SHOES/AIR%20MAX%2097/TOP.png','/images/SHOES/AIR%20MAX%2097/SOLE.png']),
    ('SMSM-MIR-AM720-009','nike-air-max-720-mirror','اير ماكس 720','Air Max 720','Nike','air-max',1650,null,12,array['Black','Silver'],'NEW',true,false,false,array['/images/SHOES/AIR%20MAX%20720/FRONT.png','/images/SHOES/AIR%20MAX%20720/LEFT.png','/images/SHOES/AIR%20MAX%20720/RIGHT.png','/images/SHOES/AIR%20MAX%20720/REAR.png','/images/SHOES/AIR%20MAX%20720/TOP.png','/images/template.svg']),
    ('SMSM-MIR-AM2021-010','nike-air-max-2021-se-mirror','اير ماكس 2021 SE','Air Max 2021 SE','Nike','air-max',1750,null,5,array['Black','White'],'LIMITED',true,false,false,array['/images/SHOES/AIR%20MAX%202021%20SE/FRONT.png','/images/SHOES/AIR%20MAX%202021%20SE/LEFT.png','/images/SHOES/AIR%20MAX%202021%20SE/RIGHT.png','/images/template.svg','/images/SHOES/AIR%20MAX%202021%20SE/TOP.png','/images/template.svg']),
    ('SMSM-MIR-AMQ-011','alexander-mcqueen-oversized-mirror','الكسندر ماكوين','Oversized Sneaker','Alexander McQueen','luxury-sneakers',1100,null,10,array['White'],'LIMITED',false,false,false,array['/images/SHOES/ALEXANDER%20MCQUEEN/FRONT.png','/images/SHOES/ALEXANDER%20MCQUEEN/LEFT.png','/images/SHOES/ALEXANDER%20MCQUEEN/RIGHT.png','/images/template.svg','/images/SHOES/ALEXANDER%20MCQUEEN/TOP.png','/images/template.svg']),
    ('SMSM-MIR-ASX-012','asics-runner-mirror','اسكس','Runner','Asics','running',1700,null,12,array['White','Black'],'BESTSELLER',true,false,true,array['/images/SHOES/ASICS/FRONT.png','/images/SHOES/ASICS/LEFT.png','/images/SHOES/ASICS/RIGHT.png','/images/template.svg','/images/SHOES/ASICS/TOP.png','/images/template.svg']),
    ('SMSM-MIR-B22-013','dior-b22-mirror','ديور B22','B22','Dior','luxury-sneakers',1700,null,2,array['White','Gray'],'LOW STOCK',false,false,false,array['/images/SHOES/B22/FRONT.png','/images/SHOES/B22/LEFT.png','/images/SHOES/B22/RIGHT.png','/images/SHOES/B22/REAR.png','/images/SHOES/B22/TOP.png','/images/SHOES/B22/SOLE.png']),
    ('SMSM-MIR-BTRK-014','balenciaga-track-sneaker-mirror','بالنسياجا تراك','Track Sneaker','Balenciaga','luxury-sneakers',3300,null,3,array['Black','Gray'],'LOW STOCK',true,false,false,array['/images/SHOES/BALENCIAGA%20TRACK/FRONT.png','/images/SHOES/BALENCIAGA%20TRACK/LEFT.png','/images/SHOES/BALENCIAGA%20TRACK/RIGHT.png','/images/SHOES/BALENCIAGA%20TRACK/REAR.png','/images/SHOES/BALENCIAGA%20TRACK/TOP.png','/images/SHOES/BALENCIAGA%20TRACK/SOLE.png']),
    ('SMSM-MIR-BAPE-015','bape-style-mirror','بايب','Bape Style','Bape','casual-shoes',1600,null,6,array['Black','White'],'NEW',false,false,false,array['/images/SHOES/BAPE/FRONT.png','/images/SHOES/BAPE/LEFT.png','/images/SHOES/BAPE/RIGHT.png','/images/template.svg','/images/SHOES/BAPE/TOP.png','/images/template.svg']),
    ('SMSM-MIR-J4-016','jordan-4-mirror','جوردن 4','Jordan 4','Jordan','jordan',1500,null,10,array['Black','White'],'BESTSELLER',true,false,true,array['/images/SHOES/JORDAN%204/FRONT.png','/images/SHOES/JORDAN%204/LEFT.png','/images/SHOES/JORDAN%204/RIGHT.png','/images/SHOES/JORDAN%204/REAR.png','/images/SHOES/JORDAN%204/TOP.png','/images/SHOES/JORDAN%204/SOLE.png']),
    ('SMSM-MIR-J11-017','jordan-11-mirror','جوردن 11','Jordan 11','Jordan','jordan',1800,null,8,array['Black','White'],'NEW',true,false,false,array['/images/SHOES/JORDAN%2011/FRONT.png','/images/SHOES/JORDAN%2011/LEFT.png','/images/SHOES/JORDAN%2011/RIGHT.png','/images/SHOES/JORDAN%2011/REAR.png','/images/SHOES/JORDAN%2011/TOP.png','/images/SHOES/JORDAN%2011/SOLE.png']),
    ('SMSM-MIR-J13-018','jordan-13-mirror','جوردن 13','Jordan 13','Jordan','jordan',1850,null,5,array['Black','Red'],'LIMITED',false,false,false,array['/images/SHOES/JORDAN%2013/FRONT.png','/images/SHOES/JORDAN%2013/LEFT.png','/images/SHOES/JORDAN%2013/RIGHT.png','/images/SHOES/JORDAN%2013/REAR.png','/images/SHOES/JORDAN%2013/TOP.png','/images/template.svg']),
    ('SMSM-MIR-LVSK-019','louis-vuitton-skate-sneaker','لوي فيتون سكايت','Skate Sneaker','Louis Vuitton','luxury-sneakers',2200,null,11,array['White','Brown'],'LIMITED',true,false,false,array['/images/SHOES/LV%20SKATE/FRONT.png','/images/SHOES/LV%20SKATE/LEFT.png','/images/SHOES/LV%20SKATE/RIGHT.png','/images/template.svg','/images/SHOES/LV%20SKATE/TOP.png','/images/template.svg']),
    ('SMSM-MIR-LVTR-020','louis-vuitton-trainer-sneaker','لوي فيتون ترينر','Trainer Sneaker','Louis Vuitton','luxury-sneakers',2300,null,8,array['White','Black'],'NEW',false,false,false,array['/images/SHOES/LV%20TRAINER/FRONT.png','/images/SHOES/LV%20TRAINER/LEFT.png','/images/SHOES/LV%20TRAINER/RIGHT.png','/images/SHOES/LV%20TRAINER/REAR.png','/images/SHOES/LV%20TRAINER/TOP.png','/images/template.svg']),
    ('SMSM-MIR-NB530-021','new-balance-530-mirror','نيو بالنس 530','530','New Balance','new-balance',1400,null,10,array['White','Navy'],'BESTSELLER',false,false,true,array['/images/SHOES/NEW%20BALANCE%20530/FRONT.png','/images/SHOES/NEW%20BALANCE%20530/LEFT.png','/images/SHOES/NEW%20BALANCE%20530/RIGHT.png','/images/SHOES/NEW%20BALANCE%20530/REAR.png','/images/SHOES/NEW%20BALANCE%20530/TOP.png','/images/SHOES/NEW%20BALANCE%20530/SOLE.png']),
    ('SMSM-MIR-NB2000-022','new-balance-2000-mirror','نيو بالنس 2000','2000','New Balance','new-balance',1700,null,6,array['Gray','Black'],'NEW',false,false,false,array['/images/SHOES/NEW%20BALANCE%202000/FRONT.png','/images/SHOES/NEW%20BALANCE%202000/LEFT.png','/images/SHOES/NEW%20BALANCE%202000/RIGHT.png','/images/SHOES/NEW%20BALANCE%202000/REAR.png','/images/SHOES/NEW%20BALANCE%202000/TOP.png','/images/template.svg']),
    ('SMSM-MIR-NB9060-023','new-balance-9060-mirror','نيو بالنس 9060','9060','New Balance','new-balance',1550,null,6,array['Gray','White'],'BESTSELLER',false,false,true,array['/images/SHOES/NEW%20BALANCE%209060/FRONT.png','/images/SHOES/NEW%20BALANCE%209060/LEFT.png','/images/SHOES/NEW%20BALANCE%209060/RIGHT.png','/images/SHOES/NEW%20BALANCE%209060/REAR.png','/images/SHOES/NEW%20BALANCE%209060/TOP.png','/images/template.svg']),
    ('SMSM-MIR-SHX-024','nike-shox-mirror','نايكي شوكس','Shox','Nike','sport-shoes',1600,null,17,array['Black','Red'],'NEW',true,false,false,array['/images/SHOES/NIKE%20SHOX/FRONT.png','/images/SHOES/NIKE%20SHOX/LEFT.png','/images/SHOES/NIKE%20SHOX/RIGHT.png','/images/template.svg','/images/SHOES/NIKE%20SHOX/TOP.png','/images/template.svg']),
    ('SMSM-MIR-SHXS-025','nike-shox-supreme-mirror','نايكي شوكس سوبريم','Shox Supreme','Nike','sport-shoes',1600,null,5,array['Black','Red'],'LIMITED',false,false,false,array['/images/SHOES/NIKE%20SHOX%20SUPREME/FRONT.png','/images/SHOES/NIKE%20SHOX%20SUPREME/LEFT.png','/images/SHOES/NIKE%20SHOX%20SUPREME/RIGHT.png','/images/template.svg','/images/SHOES/NIKE%20SHOX%20SUPREME/TOP.png','/images/template.svg']),
    ('SMSM-MIR-VM-026','nike-vm-sneaker-mirror','نايكي VM','VM Sneaker','Nike','sport-shoes',1800,null,2,array['Black'],'LOW STOCK',false,false,false,array['/images/SHOES/NIKE%20VM/FRONT.png','/images/SHOES/NIKE%20VM/LEFT.png','/images/SHOES/NIKE%20VM/RIGHT.png','/images/SHOES/NIKE%20VM/REAR.png','/images/SHOES/NIKE%20VM/TOP.png','/images/SHOES/NIKE%20VM/SOLE.png']),
    ('SMSM-MIR-TN1-027','nike-tn-1-mirror','تي ان 1','TN 1','Nike','sport-shoes',1400,null,7,array['Black','Orange'],'NEW',false,false,false,array['/images/SHOES/TN%201/FRONT.png','/images/SHOES/TN%201/LEFTpng.png','/images/SHOES/TN%201/RIGHT.png','/images/template.svg','/images/SHOES/TN%201/TOP.png','/images/template.svg']),
    ('SMSM-MIR-TN3-028','nike-tn-3-mirror','تي ان 3','TN 3','Nike','sport-shoes',1550,null,12,array['Black','Blue'],'NEW',false,false,false,array['/images/SHOES/TN%203/FRONT.png','/images/SHOES/TN%203/LEFT.png','/images/SHOES/TN%203/RIGHT.png','/images/template.svg','/images/SHOES/TN%203/TOP.png','/images/template.svg']),
    ('SMSM-MIR-TSB-029','nike-travis-sb-mirror','ترافيس SB','Travis SB','Nike','casual-shoes',1900,null,4,array['Brown','Black'],'LIMITED',false,false,false,array['/images/SHOES/TRAVIS%20SB/FRONT.png','/images/SHOES/TRAVIS%20SB/LEFT.png','/images/SHOES/TRAVIS%20SB/RIGHT.png','/images/template.svg','/images/SHOES/TRAVIS%20SB/TOP.png','/images/template.svg']),
    ('SMSM-MIR-ADISTAR-030','adidas-adistar-mirror','أديداس أديستار','Adistar','Adidas','adidas',1550,null,26,array['Black','White'],'BESTSELLER',true,false,true,array['/images/SHOES/ADIDAS%20ADISTAR/FRONT.png','/images/SHOES/ADIDAS%20ADISTAR/LEFT.png','/images/SHOES/ADIDAS%20ADISTAR/RIGHT.png','/images/template.svg','/images/SHOES/ADIDAS%20ADISTAR/TOP.png','/images/template.svg'])
)
insert into products (
  sku, slug, model, brand, name_ar, name_en, short_description_ar, short_description_en,
  description_ar, description_en, quality_grade, sell_price, old_price, category_id,
  sizes, colors, stock, status, badge, featured, on_offer, best_seller, images
)
select
  seed.sku,
  seed.slug,
  seed.model_ar,
  seed.brand,
  seed.model_ar || ' - ' || seed.brand,
  seed.brand || ' ' || seed.model_en,
  seed.model_ar || ' من ' || seed.brand || ' بجودة MIRROR وسعر بيع واضح.',
  seed.brand || ' ' || seed.model_en || ' in MIRROR grade with clear sell-only pricing.',
  seed.model_ar || ' من ' || seed.brand || ' بجودة MIRROR من SMSM STORE، بتفاصيل Premium ومقاسات 40 / 41 / 42 / 43 / 45.',
  seed.brand || ' ' || seed.model_en || ' sneaker in MIRROR grade from SMSM STORE with premium styling and sizes 40 / 41 / 42 / 43 / 45.',
  'MIRROR',
  seed.sell_price,
  seed.old_price,
  categories.id,
  array['40','41','42','43','45'],
  seed.colors,
  seed.stock,
  case when seed.stock > 0 then 'active'::product_status else 'out-of-stock'::product_status end,
  seed.badge,
  seed.featured,
  seed.on_offer,
  seed.best_seller,
  seed.images
from seed
join categories on categories.slug = seed.category_slug
on conflict (sku) do update set
  slug = excluded.slug,
  model = excluded.model,
  brand = excluded.brand,
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  short_description_ar = excluded.short_description_ar,
  short_description_en = excluded.short_description_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  quality_grade = excluded.quality_grade,
  sell_price = excluded.sell_price,
  old_price = excluded.old_price,
  category_id = excluded.category_id,
  sizes = excluded.sizes,
  colors = excluded.colors,
  stock = excluded.stock,
  status = excluded.status,
  badge = excluded.badge,
  featured = excluded.featured,
  on_offer = excluded.on_offer,
  best_seller = excluded.best_seller,
  images = excluded.images,
  updated_at = now();

update products
set status = 'inactive'::product_status,
    updated_at = now()
where sku not in (
  'SMSM-MIR-ADZ-001','SMSM-MIR-AFBR-002','SMSM-MIR-AFWL-003','SMSM-MIR-AFWM-004','SMSM-MIR-AM95C-005',
  'SMSM-MIR-AM95W-006','SMSM-MIR-AM95S-007','SMSM-MIR-AM97-008','SMSM-MIR-AM720-009','SMSM-MIR-AM2021-010',
  'SMSM-MIR-AMQ-011','SMSM-MIR-ASX-012','SMSM-MIR-B22-013','SMSM-MIR-BTRK-014','SMSM-MIR-BAPE-015',
  'SMSM-MIR-J4-016','SMSM-MIR-J11-017','SMSM-MIR-J13-018','SMSM-MIR-LVSK-019','SMSM-MIR-LVTR-020',
  'SMSM-MIR-NB530-021','SMSM-MIR-NB2000-022','SMSM-MIR-NB9060-023','SMSM-MIR-SHX-024','SMSM-MIR-SHXS-025',
  'SMSM-MIR-VM-026','SMSM-MIR-TN1-027','SMSM-MIR-TN3-028','SMSM-MIR-TSB-029','SMSM-MIR-ADISTAR-030'
);

update products
set sell_price = case slug
    when 'adidas-adistar-mirror' then 1550
    when 'nike-travis-sb-mirror' then 1500
    when 'nike-tn-3-mirror' then 1600
    when 'nike-tn-1-mirror' then 1500
    when 'nike-vm-sneaker-mirror' then 1800
    when 'nike-shox-supreme-mirror' then 1600
    when 'nike-shox-mirror' then 1600
    when 'new-balance-530-mirror' then 1500
    when 'new-balance-2000-mirror' then 1800
    when 'new-balance-9060-mirror' then 1600
    when 'louis-vuitton-skate-sneaker' then 2200
    when 'louis-vuitton-trainer-sneaker' then 2200
    when 'jordan-13-mirror' then 1750
    when 'jordan-11-mirror' then 1500
    when 'jordan-4-mirror' then 1500
    when 'dior-b22-mirror' then 2200
    when 'asics-runner-mirror' then 1700
    when 'nike-air-force-black-red-mirror' then 1500
    when 'nike-air-force-white-limited-mirror' then 1500
    else sell_price
  end,
  badge = case when badge = 'LOW STOCK' then 'LIMITED' else badge end,
  name_ar = model,
  name_en = case slug
    when 'adidas-adizero-mirror' then 'Adizero'
    when 'adidas-adistar-mirror' then 'Adistar'
    when 'asics-runner-mirror' then 'Asics'
    when 'dior-b22-mirror' then 'B22'
    when 'louis-vuitton-skate-sneaker' then 'LV Skate'
    when 'louis-vuitton-trainer-sneaker' then 'LV Trainer'
    when 'new-balance-530-mirror' then 'NB 530'
    when 'new-balance-2000-mirror' then 'NB 2000'
    when 'new-balance-9060-mirror' then 'NB 9060'
    when 'nike-vm-sneaker-mirror' then 'VM'
    when 'nike-shox-mirror' then 'Shox'
    when 'nike-shox-supreme-mirror' then 'Shox Supreme'
    when 'nike-tn-1-mirror' then 'TN1'
    when 'nike-tn-3-mirror' then 'TN3'
    else regexp_replace(name_en, '^' || brand || ' ', '', 'i')
  end,
  updated_at = now()
where sku in (
  'SMSM-MIR-ADZ-001','SMSM-MIR-AFBR-002','SMSM-MIR-AFWL-003','SMSM-MIR-AFWM-004','SMSM-MIR-AM95C-005',
  'SMSM-MIR-AM95W-006','SMSM-MIR-AM95S-007','SMSM-MIR-AM97-008','SMSM-MIR-AM720-009','SMSM-MIR-AM2021-010',
  'SMSM-MIR-AMQ-011','SMSM-MIR-ASX-012','SMSM-MIR-B22-013','SMSM-MIR-BTRK-014','SMSM-MIR-BAPE-015',
  'SMSM-MIR-J4-016','SMSM-MIR-J11-017','SMSM-MIR-J13-018','SMSM-MIR-LVSK-019','SMSM-MIR-LVTR-020',
  'SMSM-MIR-NB530-021','SMSM-MIR-NB2000-022','SMSM-MIR-NB9060-023','SMSM-MIR-SHX-024','SMSM-MIR-SHXS-025',
  'SMSM-MIR-VM-026','SMSM-MIR-TN1-027','SMSM-MIR-TN3-028','SMSM-MIR-TSB-029','SMSM-MIR-ADISTAR-030'
);
