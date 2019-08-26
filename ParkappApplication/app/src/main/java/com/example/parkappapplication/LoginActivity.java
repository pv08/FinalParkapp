package com.example.parkappapplication;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import org.mindrot.jbcrypt.BCrypt;

public class LoginActivity extends AppCompatActivity {
    Button mBtnLogin;
    EditText mTxtMatricula;
    EditText mTxtPassword;
    TextView mTxtLogin;
    TextView mTxtAlert;
    String userMatricula;
    // Write a message to the database
    DatabaseReference database = FirebaseDatabase.getInstance().getReference("Users");






    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        mBtnLogin = (Button)findViewById(R.id.btnLogin);
        mTxtLogin = (TextView)findViewById((R.id.editLogin));
        mTxtAlert = (TextView)findViewById((R.id.txtAlert));
        mTxtMatricula = (EditText)findViewById(R.id.txtMatricula);
        mTxtPassword = (EditText)findViewById(R.id.txtPassword);

    }

    @Override
    protected void onStart(){
        super.onStart();
        mBtnLogin.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view){
                Editable matricula = mTxtMatricula.getText();
                try{
                    database.orderByChild("matricula").equalTo(matricula.toString()).addListenerForSingleValueEvent(new ValueEventListener() {
                        Editable password = mTxtPassword.getText();
                        @Override
                        public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                            for (DataSnapshot datas: dataSnapshot.getChildren()){
                                String matricula = datas.child("matricula").getValue().toString();
                                String hashPassword = datas.child("password").getValue().toString();
                                if (BCrypt.checkpw(password.toString(), hashPassword)){
                                    Intent dashboard = new Intent(LoginActivity.this, DashboardActivity.class);
                                    startActivity(dashboard);
                                }else{
                                    mTxtAlert.setVisibility(View.VISIBLE);
                                }
                            }
                        }

                        @Override
                        public void onCancelled(@NonNull DatabaseError databaseError) {

                        }
                    });
                }catch (Exception e){
                    mTxtAlert.setVisibility(View.VISIBLE);
                }
            }

        });

    }
}
