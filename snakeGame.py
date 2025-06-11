import pygame
import sys
import time
import random

# **Game Initialization**
pygame.init()
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Snake Game")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# **Game Variables**
snake_pos = [100, 50]
snake_body = [[100, 50], [90, 50], [80, 50]]
food_pos = [random.randrange(1, width//10) * 10, random.randrange(1, height//10) * 10]
direction = 'right'
score = 0

# **Game Loop**
while True:
    # **Event Handling**
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP and direction!= 'down':
                direction = 'up'
            elif event.key == pygame.K_DOWN and direction!= 'up':
                direction = 'down'
            elif event.key == pygame.K_LEFT and direction!= 'right':
                direction = 'left'
            elif event.key == pygame.K_RIGHT and direction!= 'left':
                direction = 'right'

    # **Game Logic**
    if direction == 'up':
        snake_pos[1] -= 10
    elif direction == 'down':
        snake_pos[1] += 10
    elif direction == 'left':
        snake_pos[0] -= 10
    elif direction == 'right':
        snake_pos[0] += 10

    snake_body.insert(0, list(snake_pos))
    if snake_pos == food_pos:
        score += 1
        food_pos = [random.randrange(1, width//10) * 10, random.randrange(1, height//10) * 10]
    else:
        snake_body.pop()

    # **Collision Detection**
    if (snake_pos[0] < 0 or snake_pos[0] >= width or
        snake_pos[1] < 0 or snake_pos[1] >= height or
        snake_pos in snake_body[1:]):
        pygame.quit()
        sys.exit()

    # **Rendering**
    screen.fill((0, 0, 0))
    for pos in snake_body:
        pygame.draw.rect(screen, (0, 255, 0), pygame.Rect(pos[0], pos[1], 10, 10))
    pygame.draw.rect(screen, (255, 0, 0), pygame.Rect(food_pos[0], food_pos[1], 10, 10))
    text = font.render(f'Score: {score}', True, (255, 255, 255))
    screen.blit(text, (10, 10))
    pygame.display.flip()

    # **Game Speed**
    clock.tick(10)