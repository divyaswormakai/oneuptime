const ScheduledEventModel = require('../models/scheduledEvent');
const UserModel = require('../models/user');
const ErrorService = require('../services/errorService');
const RealTimeService = require('./realTimeService');

module.exports = {
    create: async function({ projectId }, data) {
        try {
            if (!data.monitors || data.monitors.length === 0) {
                const error = new Error(
                    'You need at least one monitor to create a scheduled event'
                );
                error.code = 400;
                throw error;
            }

            if (!isArrayUnique(data.monitors)) {
                const error = new Error(
                    'You cannot have multiple selection of a monitor'
                );
                error.code = 400;
                throw error;
            }

            // reassign data.monitors with a restructured monitor data
            data.monitors = data.monitors.map(monitor => ({
                monitorId: monitor,
            }));

            data.projectId = projectId;

            let scheduledEvent = await ScheduledEventModel.create({
                ...data,
            });

            scheduledEvent = await scheduledEvent
                .populate('monitors.monitorId', 'name')
                .populate('projectId', 'name')
                .populate('createdById', 'name')
                .execPopulate();

            await RealTimeService.addScheduledEvent(scheduledEvent);

            return scheduledEvent;
        } catch (error) {
            ErrorService.log('scheduledEventService.create', error);
            throw error;
        }
    },

    updateOneBy: async function(query, data) {
        if (!query) {
            query = {};
        }

        if (!query.deleted) query.deleted = false;

        try {
            if (!data.monitors || data.monitors.length === 0) {
                const error = new Error(
                    'You need at least one monitor to update a scheduled event'
                );
                error.code = 400;
                throw error;
            }

            if (!isArrayUnique(data.monitors)) {
                const error = new Error(
                    'You cannot have multiple selection of a monitor'
                );
                error.code = 400;
                throw error;
            }

            // reassign data.monitors with a restructured monitor data
            data.monitors = data.monitors.map(monitor => ({
                monitorId: monitor,
            }));

            let updatedScheduledEvent = await ScheduledEventModel.findOneAndUpdate(
                { _id: query._id },
                {
                    $set: data,
                },
                { new: true }
            );

            updatedScheduledEvent = await updatedScheduledEvent
                .populate('monitors.monitorId', 'name')
                .populate('projectId', 'name')
                .populate('createdById', 'name')
                .execPopulate();

            if (!updatedScheduledEvent) {
                const error = new Error(
                    'Scheduled Event not found or does not exist'
                );
                error.code = 400;
                throw error;
            }

            await RealTimeService.updateScheduledEvent(updatedScheduledEvent);

            return updatedScheduledEvent;
        } catch (error) {
            ErrorService.log('scheduledEventService.updateOneBy', error);
            throw error;
        }
    },

    updateBy: async function(query, data) {
        try {
            if (!query) {
                query = {};
            }

            if (!query.deleted) query.deleted = false;
            let updatedData = await ScheduledEventModel.updateMany(query, {
                $set: data,
            });
            updatedData = await this.findBy(query);
            return updatedData;
        } catch (error) {
            ErrorService.log('scheduledEventService.updateMany', error);
            throw error;
        }
    },

    deleteBy: async function(query, userId) {
        try {
            const scheduledEvent = await ScheduledEventModel.findOneAndUpdate(
                query,
                {
                    $set: {
                        deleted: true,
                        deletedAt: Date.now(),
                        deletedById: userId,
                    },
                },
                { new: true }
            );

            if (!scheduledEvent) {
                const error = new Error(
                    'Scheduled Event not found or does not exist'
                );
                error.code = 400;
                throw error;
            }

            await RealTimeService.deleteScheduledEvent(scheduledEvent);

            return scheduledEvent;
        } catch (error) {
            ErrorService.log('scheduledEventService.deleteBy', error);
            throw error;
        }
    },

    findBy: async function(query, limit, skip) {
        try {
            if (!skip) skip = 0;

            if (!limit) limit = 0;

            if (typeof skip === 'string') {
                skip = Number(skip);
            }

            if (typeof limit === 'string') {
                limit = Number(limit);
            }

            if (!query) {
                query = {};
            }

            query.deleted = false;
            const scheduledEvents = await ScheduledEventModel.find(query)
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 })
                .populate('monitors.monitorId', 'name')
                .populate('projectId', 'name')
                .populate('createdById', 'name')
                .lean();

            return scheduledEvents;
        } catch (error) {
            ErrorService.log('scheduledEventService.findBy', error);
            throw error;
        }
    },

    findOneBy: async function(query) {
        try {
            if (!query) {
                query = {};
            }

            query.deleted = false;
            const scheduledEvent = await ScheduledEventModel.findOne(query)
                .populate('monitors.monitorId', 'name')
                .populate('projectId', 'name')
                .populate('createdById', 'name')
                .lean();

            if (scheduledEvent) {
                if (scheduledEvent.createdById === 'API') {
                    scheduledEvent.createdById = {
                        name: 'API',
                        _id: null,
                    };
                } else {
                    const user = await UserModel.findOne({
                        _id: scheduledEvent.createdById,
                    }).lean();
                    scheduledEvent.createdById = {
                        _id: user._id,
                        name: user.name,
                    };
                }
            }

            return scheduledEvent;
        } catch (error) {
            ErrorService.log('scheduledEventService.findOneBy', error);
            throw error;
        }
    },

    getSubProjectScheduledEvents: async function(subProjectIds) {
        const subProjectScheduledEvents = await Promise.all(
            subProjectIds.map(async id => {
                const scheduledEvents = await this.findBy(
                    { projectId: id },
                    10,
                    0
                );
                const count = await this.countBy({ projectId: id });
                return {
                    scheduledEvents,
                    count,
                    project: id,
                    skip: 0,
                    limit: 10,
                };
            })
        );
        return subProjectScheduledEvents;
    },

    getSubProjectOngoingScheduledEvents: async function(
        subProjectIds,
        timeQuery
    ) {
        const subProjectOngoingScheduledEvents = await Promise.all(
            subProjectIds.map(async id => {
                const ongoingScheduledEvents = await this.findBy({
                    projectId: id,
                    ...timeQuery,
                });
                const count = await this.countBy({
                    projectId: id,
                    ...timeQuery,
                });
                return {
                    ongoingScheduledEvents,
                    count,
                    project: id,
                };
            })
        );

        return subProjectOngoingScheduledEvents;
    },

    countBy: async function(query) {
        try {
            if (!query) {
                query = {};
            }
            query.deleted = false;
            const count = await ScheduledEventModel.countDocuments(query);
            return count;
        } catch (error) {
            ErrorService.log('scheduledEventService.countBy', error);
            throw error;
        }
    },

    hardDeleteBy: async function(query) {
        try {
            await ScheduledEventModel.deleteMany(query);
            return 'Event(s) removed successfully!';
        } catch (error) {
            ErrorService.log('scheduledEventService.hardDeleteBy', error);
            throw error;
        }
    },

    /**
     * @description removes a particular monitor from scheduled event
     * @description if no monitor remains after deletion, then the scheduled event is deleted
     * @param {string} monitorId the id of the monitor
     * @param {string} userId the id of the user
     */
    removeMonitor: async function(monitorId, userId) {
        try {
            const scheduledEvents = await this.findBy({
                'monitors.monitorId': monitorId,
            });

            await Promise.all(
                scheduledEvents.map(async event => {
                    // remove the monitor from scheduled event monitors list
                    event.monitors = event.monitors.filter(
                        monitor =>
                            String(monitor.monitorId._id) !== String(monitorId)
                    );

                    if (event.monitors.length > 0) {
                        let updatedEvent = await ScheduledEventModel.findOneAndUpdate(
                            { _id: event._id },
                            { $set: { monitors: event.monitors } },
                            { new: true }
                        );
                        updatedEvent = await updatedEvent
                            .populate('monitors.monitorId', 'name')
                            .populate('projectId', 'name')
                            .populate('createdById', 'name')
                            .execPopulate();

                        await RealTimeService.updateScheduledEvent(
                            updatedEvent
                        );
                    } else {
                        // delete the scheduled event when no monitor is remaining
                        let deletedEvent = await ScheduledEventModel.findOneAndUpdate(
                            { _id: event._id },
                            {
                                $set: {
                                    monitors: event.monitors,
                                    deleted: true,
                                    deletedAt: Date.now(),
                                    deletedById: userId,
                                },
                            },
                            { new: true }
                        );
                        deletedEvent = await deletedEvent
                            .populate('monitors.monitorId', 'name')
                            .populate('projectId', 'name')
                            .populate('createdById', 'name')
                            .execPopulate();

                        await RealTimeService.deleteScheduledEvent(
                            deletedEvent
                        );
                    }
                })
            );
        } catch (error) {
            ErrorService.log('scheduledEventService.removeMonitor', error);
            throw error;
        }
    },

    /**
     * @description resolves a particular scheduled event
     * @param {object} query query parameter to use for db manipulation
     * @param {object} data data to be used to update the schedule
     */
    resolveScheduledEvent: async function(query, data) {
        try {
            data.resolved = true;
            data.resolvedAt = Date.now();
            const resolvedScheduledEvent = await ScheduledEventModel.findOneAndDelete(
                { query },
                { $set: data },
                { new: true }
            );
            return resolvedScheduledEvent;
        } catch (error) {
            ErrorService.log(
                'scheduledEventService.resolveScheduledEvent',
                error
            );
            throw error;
        }
    },
};

/**
 * @description checks if an array contains duplicate values
 * @param {array} myArray the array to be checked
 * @returns {boolean} true or false
 */
function isArrayUnique(myArray) {
    return myArray.length === new Set(myArray).size;
}
