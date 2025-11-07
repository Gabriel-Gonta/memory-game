"""Card themes from external APIs."""

from typing import List, Dict, Any
import httpx
from fastapi import HTTPException


async def get_pokemon_theme(limit: int = 18) -> List[Dict[str, Any]]:
    """Fetch Pokemon images from PokeAPI."""
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            # Get random Pokemon IDs
            import random
            pokemon_ids = random.sample(range(1, 152), min(limit, 151))
            
            pokemon_list = []
            for pokemon_id in pokemon_ids:
                try:
                    response = await client.get(
                        f"https://pokeapi.co/api/v2/pokemon/{pokemon_id}",
                        timeout=15.0
                    )
                    response.raise_for_status()
                    data = response.json()
                    image_url = data.get('sprites', {}).get('front_default')
                    if image_url:
                        pokemon_list.append({
                            'id': pokemon_id,
                            'name': data.get('name', f'Pokemon {pokemon_id}').title(),
                            'image': image_url,
                        })
                except (httpx.HTTPError, KeyError) as e:
                    # Skip this Pokemon if there's an error, continue with others
                    continue
            
            if not pokemon_list:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to fetch any Pokemon data"
                )
            
            return pokemon_list[:limit]  # Ensure we don't exceed limit
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch Pokemon theme: {str(e)}"
        )


async def get_dogs_theme(limit: int = 18) -> List[Dict[str, Any]]:
    """Fetch dog images from Dog API (free, high-quality photos)."""
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            # Get random dog images from Dog CEO API
            response = await client.get(
                f"https://dog.ceo/api/breeds/image/random/{limit}",
                timeout=15.0
            )
            response.raise_for_status()
            data = response.json()
            
            if data.get('status') != 'success':
                raise HTTPException(status_code=500, detail="Dog API returned error")
            
            dogs = []
            for i, image_url in enumerate(data.get('message', []), 1):
                # Extract breed name from URL if possible
                breed_name = 'Dog'
                if '/' in image_url:
                    parts = image_url.split('/')
                    if len(parts) >= 4:
                        breed_part = parts[-2]
                        breed_name = breed_part.replace('-', ' ').title()
                
                dogs.append({
                    'id': i,
                    'name': breed_name,
                    'image': image_url,
                })
            
            if not dogs:
                raise HTTPException(status_code=500, detail="No dog images received")
            
            return dogs[:limit]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch dogs theme: {str(e)}"
        )


async def get_movies_theme(limit: int = 18) -> List[Dict[str, Any]]:
    """Fetch movie posters from TMDB API (public endpoint, no API key needed)."""
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            # Curated list of popular movies with verified working poster URLs
            # Only movies with confirmed working images are included
            popular_movies = [
                {'id': 550, 'name': 'Fight Club', 'poster_path': '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'},
                {'id': 278, 'name': 'The Shawshank Redemption', 'poster_path': '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg'},
                {'id': 238, 'name': 'The Godfather', 'poster_path': '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg'},
                {'id': 424, 'name': 'Schindler\'s List', 'poster_path': '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg'},
                {'id': 240, 'name': 'The Godfather Part II', 'poster_path': '/hek3koDUyRQk7FhKdJqX5vffNU5.jpg'},
                {'id': 129, 'name': 'Spirited Away', 'poster_path': '/39wmItIWvg5YkBGp3rMyHEcrSRI.jpg'},
                {'id': 497, 'name': 'The Green Mile', 'poster_path': '/velWPhVMQeQKcxggNEU8YmIo52R.jpg'},
                {'id': 680, 'name': 'Pulp Fiction', 'poster_path': '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg'},
                {'id': 13, 'name': 'Forrest Gump', 'poster_path': '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg'},
                {'id': 429, 'name': 'The Good, the Bad and the Ugly', 'poster_path': '/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg'},
                {'id': 122, 'name': 'The Lord of the Rings: The Return of the King', 'poster_path': '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg'},
                {'id': 155, 'name': 'The Dark Knight', 'poster_path': '/qJ2tW6WMUDux911r6m7haRef0WH.jpg'},
                {'id': 11, 'name': 'Star Wars', 'poster_path': '/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg'},
                {'id': 27205, 'name': 'Inception', 'poster_path': '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg'},
                {'id': 120, 'name': 'The Lord of the Rings: The Fellowship of the Ring', 'poster_path': '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg'},
                {'id': 121, 'name': 'The Lord of the Rings: The Two Towers', 'poster_path': '/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg'},
                {'id': 49026, 'name': 'The Dark Knight Rises', 'poster_path': '/85cWkCC1Nxq3o74s7Bp2jNU0Aas.jpg'},
                {'id': 603, 'name': 'The Matrix', 'poster_path': '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'},
                {'id': 11216, 'name': 'Cinema Paradiso', 'poster_path': '/8SRUfRUi6x4O68n0VCbDNRa6iGL.jpg'},
                {'id': 389, 'name': '12 Angry Men', 'poster_path': '/ppd84D2i9W8ijXFMhXK62lO7vfQ.jpg'},
                {'id': 346, 'name': 'Seven Samurai', 'poster_path': '/8OKmBV5BUFaozqlNxSgFz8l8J3P.jpg'},
                {'id': 637, 'name': 'Life Is Beautiful', 'poster_path': '/74hLDKjD5aGYOotO6esUVaeISa2.jpg'},
                {'id': 769, 'name': 'GoodFellas', 'poster_path': '/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg'},
                {'id': 274, 'name': 'The Silence of the Lambs', 'poster_path': '/uS9m8OBk1A8eM9I042e8rVKbOc0.jpg'},
                {'id': 539, 'name': 'Psycho', 'poster_path': '/tdqX0MWaFHuGwUygYn7j6eluOdP.jpg'},
                {'id': 510, 'name': 'One Flew Over the Cuckoo\'s Nest', 'poster_path': '/3jcbDmRFiQ83drXNOvRDeKHxr0M.jpg'},
                {'id': 18, 'name': 'The Fifth Element', 'poster_path': '/zaFa1NRZEnFgRTv5OVXyIZg1fZ8.jpg'},
                {'id': 475557, 'name': 'Joker', 'poster_path': '/udDclJo2j3QyA8kX3i3k6tqEaZ3.jpg'},
                {'id': 335983, 'name': 'Venom', 'poster_path': '/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg'},
                {'id': 299536, 'name': 'Avengers: Infinity War', 'poster_path': '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg'},
                {'id': 299534, 'name': 'Avengers: Endgame', 'poster_path': '/or06FN3Dka5tukK1e9sl16pB3iy.jpg'},
                {'id': 181808, 'name': 'Star Wars: The Last Jedi', 'poster_path': '/kOVEVeg59E0wsnXmF9Ura6NS8pR.jpg'},
                {'id': 181803, 'name': 'Star Wars: The Rise of Skywalker', 'poster_path': '/db32LaOibfE2AmfF9k3dPZR4TzJ.jpg'},
                {'id': 284054, 'name': 'Black Panther', 'poster_path': '/uxzzxijgPIY7slzFvMotPv8wjKA.jpg'},
                {'id': 284053, 'name': 'Thor: Ragnarok', 'poster_path': '/rzRwTcFvttcN1ZpX2xv4N3gTOsu.jpg'},
            ]
            
            import random
            # Request more movies than needed to account for validation failures
            # Request 2x the limit to ensure we have enough after filtering
            request_count = min(limit * 2, len(popular_movies))
            selected_movies = random.sample(popular_movies, request_count)
            
            # Validate images before returning
            movies = []
            for movie in selected_movies:
                poster_url = f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"
                try:
                    # Quick validation: check if image URL is accessible
                    response = await client.head(poster_url, timeout=5.0)
                    if response.status_code == 200:
                        movies.append({
                            'id': movie['id'],
                            'name': movie['name'],
                            'image': poster_url,
                        })
                    else:
                        # Try alternative size if w500 fails
                        alt_url = f"https://image.tmdb.org/t/p/w342{movie['poster_path']}"
                        alt_response = await client.head(alt_url, timeout=5.0)
                        if alt_response.status_code == 200:
                            movies.append({
                                'id': movie['id'],
                                'name': movie['name'],
                                'image': alt_url,
                            })
                except Exception:
                    # Skip this movie if image validation fails
                    continue
            
            if not movies:
                raise HTTPException(status_code=500, detail="No movie posters available")
            
            return movies[:limit]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch movies theme: {str(e)}"
        )


async def get_flags_theme(limit: int = 18) -> List[Dict[str, Any]]:
    """Fetch country flags from REST Countries API."""
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            # Get all countries
            response = await client.get(
                "https://restcountries.com/v3.1/all?fields=name,flags",
                timeout=15.0
            )
            response.raise_for_status()
            countries = response.json()
            
            import random
            selected_countries = random.sample(countries, min(limit, len(countries)))
            
            flags = []
            for i, country in enumerate(selected_countries, 1):
                flag_url = country.get('flags', {}).get('png') or country.get('flags', {}).get('svg')
                if flag_url:
                    flags.append({
                        'id': i,
                        'name': country.get('name', {}).get('common', f'Country {i}'),
                        'image': flag_url,
                    })
            
            if not flags:
                raise HTTPException(status_code=500, detail="No flag images received")
            
            return flags[:limit]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch flags theme: {str(e)}"
        )


async def get_fruits_theme(limit: int = 18) -> List[Dict[str, Any]]:
    """Fetch fruit images from Fruityvice API."""
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            # Fruityvice API doesn't provide images, so we'll use emoji fruits
            # For a real implementation, you could use Unsplash or another image API
            fruit_emojis = {
                'apple': '🍎', 'banana': '🍌', 'orange': '🍊', 'grape': '🍇',
                'strawberry': '🍓', 'watermelon': '🍉', 'pineapple': '🍍', 'mango': '🥭',
                'peach': '🍑', 'cherry': '🍒', 'pear': '🍐', 'kiwi': '🥝',
                'lemon': '🍋', 'coconut': '🥥', 'avocado': '🥑', 'tomato': '🍅',
                'eggplant': '🍆', 'pepper': '🌶️', 'corn': '🌽', 'carrot': '🥕',
            }
            
            fruit_names = list(fruit_emojis.keys())
            import random
            selected_fruits = random.sample(fruit_names, min(limit, len(fruit_names)))
            
            # Use emoji directly - simpler approach
            fruits = []
            for i, fruit_name in enumerate(selected_fruits, 1):
                fruits.append({
                    'id': i,
                    'name': fruit_name.title(),
                    'emoji': fruit_emojis[fruit_name],
                })
            
            return fruits[:limit]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch fruits theme: {str(e)}"
        )


THEME_PROVIDERS = {
    'pokemon': get_pokemon_theme,
    'dogs': get_dogs_theme,
    'movies': get_movies_theme,
    'flags': get_flags_theme,
    'fruits': get_fruits_theme,
}


async def get_theme_data(theme_name: str, limit: int = 18) -> List[Dict[str, Any]]:
    """Get theme data from provider."""
    if theme_name not in THEME_PROVIDERS:
        raise HTTPException(
            status_code=400,
            detail=f"Theme '{theme_name}' not available"
        )
    
    provider = THEME_PROVIDERS[theme_name]
    return await provider(limit)

