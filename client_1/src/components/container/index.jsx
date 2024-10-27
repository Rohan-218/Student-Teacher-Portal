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
                    <Holder>
                        {/* <div className='h'></div> */}
                    </Holder>
                    {/* <div className='profile' id='2'></div>
                    <div className='profile' id='3'></div> */}
                </div>
            </ChildContainer>
        </Container>
    )
}
export default Page;