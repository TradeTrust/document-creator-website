import { Route, Switch } from "react-router-dom";
import { AddressBookContainer } from "./components/AddressBookContainer";
import { AddressResolverContainer } from "./components/AddressResolverContainer";
import { DynamicFormContainer } from "./components/DynamicFormContainer";
import { FormSelectionContainer } from "./components/FormSelectionContainer";
import { HomeContainer } from "./components/Home";
import { PublishContainer } from "./components/PublishContainer";
import { RevokeContainer } from "./components/RevokeContainer";
import { SettingsContainer } from "./components/SettingsContainer";
import { PageLogout } from "./pages/pageLogout";
import { PageNotFound } from "./pages/pageNotFound";

export interface RouteInterface {
  path: string;
  exact?: boolean;
  component?: React.FunctionComponent;
}
interface RouteProps {
  routes: RouteInterface[];
}

export const routes: RouteInterface[] = [
  { path: "/", exact: true, component: HomeContainer },
  { path: "/forms-selection", component: FormSelectionContainer },
  { path: "/form", component: DynamicFormContainer },
  { path: "/publish", component: PublishContainer },
  { path: "/settings/address-book", component: AddressBookContainer },
  { path: "/settings/address-resolver", component: AddressResolverContainer },
  { path: "/settings", component: SettingsContainer },
  { path: "/revoke", component: RevokeContainer },
  { path: "/logout", component: PageLogout },
  { path: "*", component: PageNotFound },
];

const routeMapper = (route: RouteInterface, id: number) => <Route key={id} {...route} />;

export const Routes = ({ routes: routeItems }: RouteProps): React.ReactElement => {
  return <Switch>{routeItems.map(routeMapper)}</Switch>;
};
