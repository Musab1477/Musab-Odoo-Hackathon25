import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { maintenanceTeams } from '@/data/mockData';
import { SmartButton } from '@/components/ui/SmartButton';
import { TechnicianAvatar } from '@/components/ui/TechnicianAvatar';
import { Plus, Users, Mail, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddTeamDialog } from '@/components/dialogs/AddTeamDialog';

export default function Teams() {
  const [showAddTeam, setShowAddTeam] = useState(false);

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title font-display">Maintenance Teams</h1>
            <p className="text-muted-foreground mt-1 hidden sm:block">Manage your maintenance teams and technicians</p>
          </div>
          <SmartButton icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddTeam(true)}>
            <span className="hidden sm:inline">Add Team</span>
            <span className="sm:hidden">Add</span>
          </SmartButton>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {maintenanceTeams.map((team, index) => (
            <div 
              key={team.id}
              className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Team Header */}
              <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg truncate">{team.name}</h3>
                      <p className="text-sm text-muted-foreground">{team.members.length} members</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1 hover:bg-muted rounded shrink-0">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Team</DropdownMenuItem>
                      <DropdownMenuItem>Add Member</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete Team</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {team.description && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{team.description}</p>
                )}
              </div>

              {/* Team Members */}
              <div className="p-4 sm:p-5">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Team Members</h4>
                <div className="space-y-3">
                  {team.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <TechnicianAvatar name={member.name} size="md" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <a 
                        href={`mailto:${member.email}`}
                        className="p-2 hover:bg-background rounded-lg transition-colors shrink-0"
                        title={member.email}
                      >
                        <Mail className="w-4 h-4 text-muted-foreground" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                <Link 
                  to={`/requests?team=${team.id}`}
                  className="block text-center py-3 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  View Team Requests
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <AddTeamDialog open={showAddTeam} onOpenChange={setShowAddTeam} />
    </MainLayout>
  );
}
