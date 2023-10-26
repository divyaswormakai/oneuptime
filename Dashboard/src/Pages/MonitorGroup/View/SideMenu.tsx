import React, { FunctionComponent, ReactElement } from 'react';
import Route from 'Common/Types/API/Route';
import IconProp from 'Common/Types/Icon/IconProp';
import SideMenu from 'CommonUI/src/Components/SideMenu/SideMenu';
import SideMenuItem from 'CommonUI/src/Components/SideMenu/SideMenuItem';
import SideMenuSection from 'CommonUI/src/Components/SideMenu/SideMenuSection';
import RouteMap, { RouteUtil } from '../../../Utils/RouteMap';
import PageMap from '../../../Utils/PageMap';
import ObjectID from 'Common/Types/ObjectID';

export interface ComponentProps {
    modelId: ObjectID;
}

const DashboardSideMenu: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    return (
        <SideMenu>
            <SideMenuSection title="Basic">
                <SideMenuItem
                    link={{
                        title: 'Overview',
                        to: RouteUtil.populateRouteParams(
                            RouteMap[PageMap.MONITOR_GROUP_VIEW] as Route,
                            { modelId: props.modelId }
                        ),
                    }}
                    icon={IconProp.Info}
                />

                <SideMenuItem
                    link={{
                        title: 'Owners',
                        to: RouteUtil.populateRouteParams(
                            RouteMap[PageMap.MONITOR_GROUP_VIEW_OWNERS] as Route,
                            { modelId: props.modelId }
                        ),
                    }}
                    icon={IconProp.Team}
                />


            </SideMenuSection>

            <SideMenuSection title="Monitors and Incidents">

                <SideMenuItem
                    link={{
                        title: 'Monitors',
                        to: RouteUtil.populateRouteParams(
                            RouteMap[PageMap.MONITOR_GROUP_VIEW_MONITORS] as Route,
                            { modelId: props.modelId }
                        ),
                    }}
                    icon={IconProp.AltGlobe}
                />

                <SideMenuItem
                    link={{
                        title: 'Incidents',
                        to: RouteUtil.populateRouteParams(
                            RouteMap[PageMap.MONITOR_GROUP_VIEW_INCIDENTS] as Route,
                            { modelId: props.modelId }
                        ),
                    }}
                    icon={IconProp.Alert}
                />
            </SideMenuSection>

            <SideMenuSection title="Advanced">

                <SideMenuItem
                    link={{
                        title: 'Delete Group',
                        to: RouteUtil.populateRouteParams(
                            RouteMap[PageMap.MONITOR_GROUP_VIEW_DELETE] as Route,
                            { modelId: props.modelId }
                        ),
                    }}
                    icon={IconProp.Trash}
                    className="danger-on-hover"
                />
            </SideMenuSection>
        </SideMenu>
    );
};

export default DashboardSideMenu;
