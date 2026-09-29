-- Correct the last round of portraits.

update members set portrait_url = '/images/crew-saynt.jpg' where id = 'saynt';
update members set portrait_url = '/images/crew-xanon-hb.jpg' where id = 'xanon';
update members set portrait_url = '/images/crew-tumi-plaid.jpg' where id = 'tumi';
update members set portrait_url = '/images/crew-mbeha-wall.jpg' where id = 'mbeha';
update members set portrait_url = '/images/crew-basco-suit.jpg' where id = 'basco';
update members set portrait_url = '/images/crew-ggee-shear.jpg' where id = 'ggee';

update posts set author_avatar = '/images/crew-saynt.jpg'
where user_id = 'house' and author_name = 'EMP Saynt';
