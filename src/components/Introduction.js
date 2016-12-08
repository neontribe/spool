import React, { Component } from 'react';

import Layout from './Layout';
const { Header, Content } = Layout;

export default class Introduction extends Component {
    render () {
        return (
            <Layout>
                <Header>
                    <p>Progress</p>
                </Header>
                <Content>
                    <p>Fml</p>
                </Content>
            </Layout>
        );
    }
}
