import React, { useState, useEffect } from 'react';
import { Check, Star, Heart, Book, Apple, Droplet, PlayCircle, Home, Smile, Award, ChevronDown, ChevronUp } from 'lucide-react';

const DailyChecklist = () => {
  // Load saved state from localStorage
  const loadSavedState = () => {
    try {
      const savedState = localStorage.getItem('75StrongKids');
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
    // Default state if nothing is saved
    return {
      day: 1,
      strikes: 0,
      lastCompletedDate: null,
      tasks: {
        nutrition: {
          fruits: false,
          veggies: false,
          water: false,
          noSugar: false
        },
        movement: {
          outsidePlay: false,
          exercise: false
        },
        learning: {
          activity: false
        },
        responsibility: {
          task: false
        },
        kindness: {
          task: false
        }
      }
    };
  };

  const savedState = loadSavedState();
  const [day, setDay] = useState(savedState.day);
  const [strikes, setStrikes] = useState(savedState.strikes);
  const [lastCompletedDate, setLastCompletedDate] = useState(savedState.lastCompletedDate);
  const [tasks, setTasks] = useState(savedState.tasks);
  const [expandedSection, setExpandedSection] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      day,
      strikes,
      lastCompletedDate,
      tasks
    };
    localStorage.setItem('75StrongKids', JSON.stringify(state));
  }, [day, strikes, lastCompletedDate, tasks]);

  const milestones = [
    { day: 1, reward: "🌟 Starting Strong!" },
    { day: 7, reward: "🏆 One Week Warrior" },
    { day: 14, reward: "🎯 Two Week Champion" },
    { day: 30, reward: "🌈 Monthly Master" },
    { day: 50, reward: "⚡ Halfway Hero" },
    { day: 75, reward: "👑 75 Strong Legend" }
  ];

  const nextMilestone = milestones.find(m => m.day > day) || milestones[milestones.length - 1];

  const resetDay = () => {
    setTasks({
      nutrition: {
        fruits: false,
        veggies: false,
        water: false,
        noSugar: false
      },
      movement: {
        outsidePlay: false,
        exercise: false
      },
      learning: {
        activity: false
      },
      responsibility: {
        task: false
      },
      kindness: {
        task: false
      }
    });
  };

  const handleNextDay = () => {
    const allTasksCompleted = Object.values(tasks).every(category =>
      Object.values(category).every(task => task)
    );

    if (allTasksCompleted) {
      setShowConfetti(true);
      const today = new Date().toDateString();
      setLastCompletedDate(today);

      setTimeout(() => {
        setShowConfetti(false);
        setDay(prev => prev + 1);
        resetDay();
        if (strikes > 0) setStrikes(prev => prev - 1);
      }, 2000);
    } else {
      setStrikes(prev => prev + 1);
      if (strikes + 1 >= 3) {
        setDay(1);
        setStrikes(0);
      }
    }
  };

  const toggleTask = (category, task) => {
    setTasks(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [task]: !prev[category][task]
      }
    }));
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setDay(1);
      setStrikes(0);
      setLastCompletedDate(null);
      resetDay();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl animate-bounce">🎉</div>
          </div>
        </div>
      )}

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">75 Strong Kids Challenge</h1>
        <div className="flex justify-center items-center gap-4">
          <div className="text-lg font-semibold">Day {day} of 75</div>
          <div className="text-red-500 font-semibold">Strikes: {strikes}/3</div>
        </div>
        <div className="mt-2 text-sm text-purple-600">
          Next milestone: {nextMilestone.reward} in {nextMilestone.day - day} days!
        </div>
      </div>

      <div className="space-y-4">
        {/* Nutrition Section */}
        <div className="bg-green-50 rounded-lg overflow-hidden">
          <button
            className="w-full p-4 flex justify-between items-center text-left"
            onClick={() => toggleSection('nutrition')}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Apple className="text-green-500" />
              Nutrition Tasks
            </h2>
            {expandedSection === 'nutrition' ? <ChevronUp /> : <ChevronDown />}
          </button>

          {expandedSection === 'nutrition' && (
            <div className="p-4 pt-0 space-y-3">
              <TaskItem
                label="Eat 2 fruits"
                examples="🍎 Apple, 🍌 Banana, 🍊 Orange, 🫐 Berries"
                checked={tasks.nutrition.fruits}
                onClick={() => toggleTask('nutrition', 'fruits')}
              />
              <TaskItem
                label="Eat 2 vegetables"
                examples="🥕 Carrots, 🥦 Broccoli, 🥬 Lettuce, 🍅 Tomatoes"
                checked={tasks.nutrition.veggies}
                onClick={() => toggleTask('nutrition', 'veggies')}
              />
              <TaskItem
                label="Drink 6-8 glasses of water"
                examples="💧 Tip: Mark each glass on your water bottle!"
                checked={tasks.nutrition.water}
                onClick={() => toggleTask('nutrition', 'water')}
              />
              <TaskItem
                label="No sugary drinks or candy"
                examples="🚫 Soda, 🚫 Candy, 🚫 Cookies (unless it's a special day!)"
                checked={tasks.nutrition.noSugar}
                onClick={() => toggleTask('nutrition', 'noSugar')}
              />
            </div>
          )}
        </div>

        {/* Movement Section */}
        <div className="bg-blue-50 rounded-lg overflow-hidden">
          <button
            className="w-full p-4 flex justify-between items-center text-left"
            onClick={() => toggleSection('movement')}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <PlayCircle className="text-blue-500" />
              Movement Tasks
            </h2>
            {expandedSection === 'movement' ? <ChevronUp /> : <ChevronDown />}
          </button>

          {expandedSection === 'movement' && (
            <div className="p-4 pt-0 space-y-3">
              <TaskItem
                label="30 minutes outside play"
                examples="🏃‍♂️ Run, 🚴‍♂️ Bike, 🛹 Skateboard, ⚽ Sports"
                checked={tasks.movement.outsidePlay}
                onClick={() => toggleTask('movement', 'outsidePlay')}
              />
              <TaskItem
                label="20 minutes exercise/sports"
                examples="🏃‍♀️ PE Class, 🏊‍♂️ Swimming, ⚽ Soccer practice"
                checked={tasks.movement.exercise}
                onClick={() => toggleTask('movement', 'exercise')}
              />
            </div>
          )}
        </div>

        {/* Learning Section */}
        <div className="bg-purple-50 rounded-lg overflow-hidden">
          <button
            className="w-full p-4 flex justify-between items-center text-left"
            onClick={() => toggleSection('learning')}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Book className="text-purple-500" />
              Learning Task
            </h2>
            {expandedSection === 'learning' ? <ChevronUp /> : <ChevronDown />}
          </button>

          {expandedSection === 'learning' && (
            <div className="p-4 pt-0">
              <TaskItem
                label="Complete today's learning activity"
                examples="📚 Read 4 pages, 🎵 Practice instrument, 🧮 Extra math practice"
                checked={tasks.learning.activity}
                onClick={() => toggleTask('learning', 'activity')}
              />
            </div>
          )}
        </div>

        {/* Responsibility Section */}
        <div className="bg-orange-50 rounded-lg overflow-hidden">
          <button
            className="w-full p-4 flex justify-between items-center text-left"
            onClick={() => toggleSection('responsibility')}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Home className="text-orange-500" />
              Responsibility Task
            </h2>
            {expandedSection === 'responsibility' ? <ChevronUp /> : <ChevronDown />}
          </button>

          {expandedSection === 'responsibility' && (
            <div className="p-4 pt-0">
              <TaskItem
                label="Complete one responsibility task"
                examples="🛏️ Make bed, 🎒 Pack school bag, 🧹 Clean room, 🍽️ Help with dishes"
                checked={tasks.responsibility.task}
                onClick={() => toggleTask('responsibility', 'task')}
              />
            </div>
          )}
        </div>

        {/* Kindness Section */}
        <div className="bg-pink-50 rounded-lg overflow-hidden">
          <button
            className="w-full p-4 flex justify-between items-center text-left"
            onClick={() => toggleSection('kindness')}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Heart className="text-pink-500" />
              Kindness Task
            </h2>
            {expandedSection === 'kindness' ? <ChevronUp /> : <ChevronDown />}
          </button>

          {expandedSection === 'kindness' && (
            <div className="p-4 pt-0">
              <TaskItem
                label="Complete one kindness task"
                examples="💝 Help someone, 📝 Write a thank you note, 🤝 Share with others"
                checked={tasks.kindness.task}
                onClick={() => toggleTask('kindness', 'task')}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Award />
          Complete Day {day}
        </button>

        {/* Parent Reset Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleResetProgress}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Reset Progress (Parent Only)
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskItem = ({ label, examples, checked, onClick }) => (
  <div className="space-y-1">
    <div
      className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-white transition-colors ${
        checked ? 'text-green-600' : 'text-gray-700'
      }`}
      onClick={onClick}
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
        checked ? 'border-green-500 bg-green-500' : 'border-gray-300'
      }`}>
        {checked && <Check className="w-4 h-4 text-white" />}
      </div>
      <span className="flex-1 font-medium">{label}</span>
    </div>
    {examples && (
      <div className="text-sm text-gray-600 ml-11">
        Ideas: {examples}
      </div>
    )}
  </div>
);

export default DailyChecklist;