from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class UserStats(BaseModel):
    avg_pace: float      # sec/km
    goal_pace: float     # sec/km
    weekly_distance: float  # km

class Run(BaseModel):
    day: str
    type: str
    distance: float
    target_pace: float

class Plan(BaseModel):
    runs: List[Run]

@app.post("/generate_plan", response_model=Plan)
def generate_plan(stats: UserStats):
    easy_pace = stats.avg_pace + 30
    tempo_pace = max(stats.avg_pace - 10, stats.goal_pace)
    long_distance = max(stats.weekly_distance * 0.4, 8)
    plan = [
        Run(day="Tuesday", type="Easy", distance=round(stats.weekly_distance * 0.3, 1), target_pace=easy_pace),
        Run(day="Thursday", type="Tempo", distance=round(stats.weekly_distance * 0.2, 1), target_pace=tempo_pace),
        Run(day="Sunday", type="Long", distance=round(long_distance, 1), target_pace=easy_pace + 10),
    ]
    return Plan(runs=plan)
