import mysql from 'mysql2';
import dateFormat, { masks } from 'dateformat';
import { DBConstant, StatusConstant } from './config.mjs';

// node 날짜 function
export const getNow = () => {
    var now = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Seoul'
    });
    var toDay = dateFormat(now, 'yyyy-mm-dd H:MM:ss');
    return toDay;
}

const pool = mysql.createPool({
    host: DBConstant.host,
    port: DBConstant.port,
    user: DBConstant.user,
    password: DBConstant.password,
    database: DBConstant.database,
    connectionLimit: 10,
    multipleStatements: true
});

// 입금처리가 완료되지 않은 내역을 가져옴
export const getDepositHistory = async () => {
    const query = `SELECT * FROM user_deposit_list WHERE status = ${StatusConstant.deposit.pending} LIMIT 1`;
    return new Promise((resolve, reject) => {
        pool.query(query, function(err, rows, fuilds){    
            if(err){
                reject(err)
            } else {
                resolve(rows);
            }
        });
    });
}

// Transaction의 상태값 업데이트
export const updateDepositHistory = async (id, state) => {
    const date = getNow();
    const query = `UPDATE user_deposit_list SET status = ${state}, updated_at = '${date}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
        pool.query(query, function(err, rows, fuilds){
            if(err){
                reject(err)
            } else {
                resolve(true);
            }
        });
    });
}

//출금 신청 내역
export const getWithdrawHistory = async () => {
    const query = `SELECT * FROM user_withdraw_list WHERE status = ${StatusConstant.withdraw.pending} LIMIT 1`;
    return new Promise((resolve, reject) => {
        pool.query(query, function(err, rows, fuilds){    
            if(err){
                reject(err)
            } else {
                resolve(rows);
            }
        });
    });
}

// Transaction의 상태값 업데이트
export const updateWithdrawHistory = async (id, state, tx_id) => {
    const date = getNow();
    const query = `UPDATE user_withdraw_list SET status = ${state}, tx_id = '${tx_id}', updated_at = '${date}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
        pool.query(query, function(err, rows, fuilds){
            if(err){
                reject(err)
            } else {
                resolve(true);
            }
        });
    });
}

// 수당으로 발생한 토큰 전송 목록
export const getAllowanceHistory = async () => {
    const query = `SELECT * FROM transaction_history WHERE status = ${StatusConstant.withdraw.pending} AND network = 'TRC' LIMIT 1`;
    return new Promise((resolve, reject) => {
        pool.query(query, function(err, rows, fuilds){    
            if(err){
                reject(err)
            } else {
                resolve(rows);
            }
        });
    });
}

// 수당으로 발생한 토큰 전송 상태값 업데이트
export const updateAllowanceHistory = async (id, state, tx_id) => {
    const date = getNow();
    const query = `UPDATE transaction_history SET status = ${state}, tx_id = '${tx_id}', updated_at = '${date}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
        pool.query(query, function(err, rows, fuilds){
            if(err){
                reject(err)
            } else {
                resolve(true);
            }
        });
    });
}