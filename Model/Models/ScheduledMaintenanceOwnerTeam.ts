import Project from './Project';
import ScheduledMaintenance from './ScheduledMaintenance';
import Team from './Team';
import User from './User';
import BaseModel from 'Common/Models/BaseModel';
import Route from 'Common/Types/API/Route';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
import ColumnType from 'Common/Types/Database/ColumnType';
import CrudApiEndpoint from 'Common/Types/Database/CrudApiEndpoint';
import EnableDocumentation from 'Common/Types/Database/EnableDocumentation';
import EnableWorkflow from 'Common/Types/Database/EnableWorkflow';
import TableColumn from 'Common/Types/Database/TableColumn';
import TableColumnType from 'Common/Types/Database/TableColumnType';
import TableMetadata from 'Common/Types/Database/TableMetadata';
import TenantColumn from 'Common/Types/Database/TenantColumn';
import IconProp from 'Common/Types/Icon/IconProp';
import ObjectID from 'Common/Types/ObjectID';
import Permission from 'Common/Types/Permission';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@EnableDocumentation()
@TenantColumn('projectId')
@TableAccessControl({
    create: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CreateScheduledMaintenanceOwnerTeam,
    ],
    read: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.ReadScheduledMaintenanceOwnerTeam,
    ],
    delete: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.DeleteScheduledMaintenanceOwnerTeam,
    ],
    update: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.EditScheduledMaintenanceOwnerTeam,
    ],
})
@EnableWorkflow({
    create: true,
    delete: true,
    update: true,
    read: true,
})
@CrudApiEndpoint(new Route('/scheduled-maintenance-owner-team'))
@TableMetadata({
    tableName: 'ScheduledMaintenanceOwnerTeam',
    singularName: 'Scheduled Maintenance Team Owner',
    pluralName: 'Scheduled Maintenance Team Owners',
    icon: IconProp.Signal,
    tableDescription:
        'Add teams as owners to your Scheduled Maintenance event.',
})
@Entity({
    name: 'ScheduledMaintenanceOwnerTeam',
})
export default class ScheduledMaintenanceOwnerTeam extends BaseModel {
    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CreateScheduledMaintenanceOwnerTeam,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.ReadScheduledMaintenanceOwnerTeam,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'projectId',
        type: TableColumnType.Entity,
        modelType: Project,
        title: 'Project',
        description:
            'Relation to Project Resource in which this object belongs',
    })
    @ManyToOne(
        (_type: string) => {
            return Project;
        },
        {
            eager: false,
            nullable: false,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'projectId' })
    public project?: Project = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CreateScheduledMaintenanceOwnerTeam,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.ReadScheduledMaintenanceOwnerTeam,
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'Project ID',
        description:
            'ID of your OneUptime Project in which this object belongs',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public projectId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CreateScheduledMaintenanceOwnerTeam,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.ReadScheduledMaintenanceOwnerTeam,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'teamId',
        type: TableColumnType.Entity,
        modelType: Team,
        title: 'Team',
        description:
            'Team that is the owner. All users in this team will receive notifications. ',
    })
    @ManyToOne(
        (_type: string) => {
            return Team;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'teamId' })
    public team?: Team = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CreateScheduledMaintenanceOwnerTeam,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.ReadScheduledMaintenanceOwnerTeam,
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'Team ID',
        description: 'ID of your OneUptime Team in which this object belongs',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public teamId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CreateScheduledMaintenanceOwnerTeam,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.ReadScheduledMaintenanceOwnerTeam,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'scheduledMaintenanceId',
        type: TableColumnType.Entity,
        modelType: ScheduledMaintenance,
        title: 'ScheduledMaintenance',
        description:
            'Relation to ScheduledMaintenance Resource in which this object belongs',
    })
    @ManyToOne(
        (_type: string) => {
            return ScheduledMaintenance;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'scheduledMaintenanceId' })
    public scheduledMaintenance?: ScheduledMaintenance = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CreateScheduledMaintenanceOwnerTeam,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.ReadScheduledMaintenanceOwnerTeam,
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'ScheduledMaintenance ID',
        description:
            'ID of your OneUptime ScheduledMaintenance in which this object belongs',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public scheduledMaintenanceId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CreateScheduledMaintenanceOwnerTeam,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.ReadScheduledMaintenanceOwnerTeam,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'createdByUserId',
        type: TableColumnType.Entity,
        modelType: User,
        title: 'Created by User',
        description:
            'Relation to User who created this object (if this object was created by a User)',
    })
    @ManyToOne(
        (_type: string) => {
            return User;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'createdByUserId' })
    public createdByUser?: User = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CreateScheduledMaintenanceOwnerTeam,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.ReadScheduledMaintenanceOwnerTeam,
        ],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Created by User ID',
        description:
            'User ID who created this object (if this object was created by a User)',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public createdByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.ReadScheduledMaintenanceOwnerTeam,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'deletedByUserId',
        type: TableColumnType.Entity,
        title: 'Deleted by User',
        description:
            'Relation to User who deleted this object (if this object was deleted by a User)',
    })
    @ManyToOne(
        (_type: string) => {
            return User;
        },
        {
            cascade: false,
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'deletedByUserId' })
    public deletedByUser?: User = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.ReadScheduledMaintenanceOwnerTeam,
        ],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Deleted by User ID',
        description:
            'User ID who deleted this object (if this object was deleted by a User)',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public deletedByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CreateScheduledMaintenanceOwnerTeam,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.ReadScheduledMaintenanceOwnerTeam,
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.Boolean,
        required: true,
        isDefaultValueColumn: true,
        title: 'Are Owners Notified',
        description: 'Are owners notified of this resource ownership?',
    })
    @Column({
        type: ColumnType.Boolean,
        nullable: false,
        default: false,
    })
    public isOwnerNotified?: boolean = undefined;
}
