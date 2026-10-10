'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
  User,
  X,
  Phone,
  MessageCircle,
  FileText,
  Eye,
} from 'lucide-react';
import { TaskItem } from '@/types/crm';
import { initialAgents } from '@/data/mockData';

interface TasksModuleProps {
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: TaskItem) => void;
}

export const TasksModule: React.FC<TasksModuleProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    relatedEntity: '',
    assignedAgent: initialAgents[0].name,
    dueDate: 'Today, 5:00 PM',
    priority: 'High' as TaskItem['priority'],
    type: 'Call' as TaskItem['type'],
    notes: '',
  });

  const filteredTasks = tasks.filter((t) => {
    const matchesPriority =
      filterPriority === 'all' || t.priority.toLowerCase() === filterPriority.toLowerCase();
    const matchesStatus =
      filterStatus === 'all' || t.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesPriority && matchesStatus;
  });

  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const urgentCount = tasks.filter((t) => t.priority === 'Urgent' && t.status === 'Pending').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newTask: TaskItem = {
      id: `tsk-${Date.now()}`,
      title: formData.title,
      relatedEntity: formData.relatedEntity || 'General Follow-up',
      assignedAgent: formData.assignedAgent,
      dueDate: formData.dueDate,
      priority: formData.priority,
      type: formData.type,
      status: 'Pending',
      notes: formData.notes || 'Created via Tasks operational manager.',
    };

    onAddTask(newTask);
    setIsAddModalOpen(false);
    setFormData({
      title: '',
      relatedEntity: '',
      assignedAgent: initialAgents[0].name,
      dueDate: 'Today, 5:00 PM',
      priority: 'High',
      type: 'Call',
      notes: '',
    });
  };

  const getTypeIcon = (type: TaskItem['type']) => {
    switch (type) {
      case 'Call':
        return <Phone className="h-3.5 w-3.5 text-blue-400" />;
      case 'WhatsApp':
        return <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />;
      case 'Viewing':
        return <Eye className="h-3.5 w-3.5 text-amber-400" />;
      case 'Contract':
      case 'DLD Escrow':
        return <FileText className="h-3.5 w-3.5 text-alamera-red" />;
      default:
        return <Clock className="h-3.5 w-3.5 text-alamera-muted" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-alamera-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs uppercase tracking-widest text-alamera-red font-semibold">
              Operational Task Engine
            </span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/20">
              Active Daily Checklist
            </span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-bold text-white">
            Tasks & Client Follow-ups
          </h2>
          <p className="mt-1 font-sans text-xs text-alamera-muted">
            Manage time-sensitive Dubai Land Department escrow milestones, VIP viewings, and client follow-ups across the advisory team.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center space-x-2 rounded border border-alamera-red bg-alamera-red px-4 py-2.5 text-xs font-semibold text-white hover:bg-alamera-redDark transition shadow-alameraRed touch-target"
        >
          <Plus className="h-4 w-4" />
          <span>Add Operational Task</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Pending Tasks
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-white block">
            {pendingCount} Actions
          </span>
          <span className="font-sans text-[10px] text-alamera-muted">Across all broker mandates</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Urgent Escrow Milestones
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-alamera-red block">
            {urgentCount} High Priority
          </span>
          <span className="font-sans text-[10px] text-alamera-red/90">Requires same-day clearance</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Completed Today
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-emerald-400 block">
            {completedCount} Completed
          </span>
          <span className="font-sans text-[10px] text-emerald-400">Audit trail logged</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Broker Coverage
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-white block">
            {initialAgents.length} Brokers
          </span>
          <span className="font-sans text-[10px] text-alamera-muted">Assigned and tracked</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-lg border border-alamera-border bg-alamera-card p-3">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-alamera-muted" />
          <span className="font-sans text-xs font-semibold text-white">Filter Tasks:</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-alamera-silver focus:border-alamera-red focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending Only</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-alamera-silver focus:border-alamera-red focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent Priority</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="rounded-lg border border-alamera-border bg-alamera-card divide-y divide-alamera-border overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-alamera-muted">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-40 text-emerald-400" />
            <p className="font-serif text-sm text-white">No tasks match the active filters.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition hover:bg-alamera-dark/40 ${
                  isCompleted ? 'opacity-60 bg-alamera-darkest/40' : ''
                }`}
              >
                <div className="flex items-start space-x-3.5 min-w-0">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="mt-0.5 text-alamera-muted hover:text-alamera-red transition touch-target flex items-center justify-center flex-shrink-0"
                    title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                  >
                    {isCompleted ? (
                      <CheckSquare className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Square className="h-5 w-5 text-alamera-muted hover:text-white" />
                    )}
                  </button>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center space-x-1 rounded bg-alamera-darkest px-2 py-0.5 font-mono text-[9px] text-alamera-silver border border-alamera-border">
                        {getTypeIcon(task.type)}
                        <span>{task.type}</span>
                      </span>

                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold ${
                          task.priority === 'Urgent'
                            ? 'bg-alamera-red/15 text-alamera-red border border-alamera-red/30'
                            : task.priority === 'High'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {task.priority}
                      </span>

                      <span className="font-mono text-[10px] text-alamera-muted flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {task.dueDate}</span>
                      </span>
                    </div>

                    <h4
                      className={`font-serif text-sm font-semibold ${
                        isCompleted
                          ? 'line-through text-alamera-muted'
                          : 'text-white'
                      }`}
                    >
                      {task.title}
                    </h4>

                    <p className="font-sans text-xs text-alamera-muted">
                      {task.notes}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-alamera-silver pt-0.5">
                      <span className="text-white">Principal: {task.relatedEntity}</span>
                      <span>•</span>
                      <span className="text-alamera-muted">Broker: {task.assignedAgent}</span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right flex items-center sm:flex-col justify-between sm:justify-center border-t sm:border-t-0 border-alamera-border/40 pt-2 sm:pt-0">
                  <span
                    className={`font-mono text-[10px] uppercase font-semibold ${
                      isCompleted ? 'text-emerald-400' : 'text-alamera-muted'
                    }`}
                  >
                    {task.status}
                  </span>
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="sm:mt-2 text-xs font-mono text-alamera-red hover:underline"
                  >
                    {isCompleted ? 'Re-open' : 'Done ✓'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-lg border border-alamera-border bg-alamera-card p-5 sm:p-6 shadow-alameraCard text-left my-8">
            <div className="flex items-center justify-between border-b border-alamera-border pb-3">
              <div>
                <span className="font-mono text-[10px] text-alamera-red uppercase font-semibold">
                  Action Scheduler
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  Add Operational Task
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded p-1 text-alamera-muted hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verify DLD Escrow deposit with trustee"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                  Related Mandate / Client
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lord Arthur Sterling-Grosvenor (AED 92M)"
                  value={formData.relatedEntity}
                  onChange={(e) => setFormData({ ...formData, relatedEntity: e.target.value })}
                  className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    Task Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as TaskItem['type'] })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-2.5 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                  >
                    <option value="Call">Client Call</option>
                    <option value="WhatsApp">WhatsApp Message</option>
                    <option value="Viewing">Private Viewing</option>
                    <option value="DLD Escrow">DLD Escrow</option>
                    <option value="Contract">Contract / Form F</option>
                    <option value="Site Inspection">Site Inspection</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskItem['priority'] })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-2.5 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                  >
                    <option value="Urgent">Urgent Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    Due Date / Time
                  </label>
                  <input
                    type="text"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    Assigned Broker
                  </label>
                  <select
                    value={formData.assignedAgent}
                    onChange={(e) => setFormData({ ...formData, assignedAgent: e.target.value })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-2.5 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                  >
                    {initialAgents.map((ag) => (
                      <option key={ag.id} value={ag.name}>
                        {ag.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                  Action Instructions / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Escrow account numbers, trustee appointments..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-alamera-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded px-4 py-2 font-mono text-xs text-alamera-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-alamera-red px-5 py-2 font-mono text-xs font-semibold text-white hover:bg-alamera-redDark shadow-alameraRed transition"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
