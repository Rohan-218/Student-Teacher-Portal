import { Navbar } from './navbar.jsx';
import { Sidebar } from './sidebar.jsx';
import { Container, ChildContainer, Holder } from './container.jsx';

const Page = () => {
    return (
        <Container>
            <Navbar>
                <h1>Rakshita Panda</h1>
            </Navbar>
            <ChildContainer>
                <div>
                    <Sidebar>
                        <button></button>
                        <button></button>
                        <button></button>
                    </Sidebar>
                </div>
                <div>
                    <Holder />
                    <Holder />
                    <Holder />
                </div>
            </ChildContainer>
        </Container>
    )
}
export default Page;