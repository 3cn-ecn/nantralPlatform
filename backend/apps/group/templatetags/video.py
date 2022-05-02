from django import template

register = template.Library()

@register.inclusion_tag('group/included/video.html')
def video(video_url):
    try:
        if 'youtube' in video_url:
            from urllib.parse import parse_qs, urlparse
            video_id = parse_qs(urlparse(video_url).query)['v'][0]
            video_type = 'youtube'
        elif 'youtu.be' in video_url:
            video_id = video_url.split('?')[0].split('/')[-1]
            video_type = 'youtube'
        elif 'dailymotion' in video_url:
            video_id = video_url.split('?')[0].split('/')[-1]
            video_type = 'dailymotion'
        else:
            raise Exception("Lien non reconnu")
    except Exception:
        video_type = None
        video_id = None
    return {'video_type': video_type, 'video_id': video_id}

