alter table posts add column if not exists gallery text not null default '';

insert into posts (
  user_id, author_name, author_avatar, kind, title, body, media_url, gallery, is_official, created_at
) values (
  'house',
  'EMP Saynt',
  '/images/crew-saynt.jpg',
  'photo',
  'Coconut Lounge',
  'On 30 May, EMP Exclusive held a private night at Coconut Lounge. The house arrived in black and white and stayed from five in the evening until midnight.

It was a closed outing, not an open drop. The joining fee sat at 180 pula and above, and transport home was arranged before the doors opened. What the family kept from it is simpler than the card: the floor held, the night ran long, and it is one they will remember.

The stills below are from that outing. The last frame is the card the house put out.',
  '/images/post-coconut-floor.jpg',
  E'/images/post-coconut-arrival.jpg\n/images/post-coconut-flyer.jpg',
  true,
  '2026-05-30 19:00:00+00'
);
